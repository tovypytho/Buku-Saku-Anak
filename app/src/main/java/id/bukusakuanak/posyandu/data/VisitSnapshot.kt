package id.bukusakuanak.posyandu.data

import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate
import java.time.LocalTime
import java.util.Locale

internal const val LEGACY_FORMAT = "buku-saku-anak.html"
internal const val MAX_TRANSFER_BYTES = 8 * 1024 * 1024

internal class InvalidVisits(message: String) : IllegalArgumentException(message)

internal class VisitSnapshot private constructor(
    val selected: String?,
    val children: Map<String, JSONObject>,
    val visits: Map<String, JSONObject>,
) {
    fun json() = JSONObject()
        .put("version", 1)
        .put("selected", selected ?: JSONObject.NULL)
        .put("children", JSONArray(children.values.toList()))
        .put("visits", JSONArray(visits.values.toList()))

    fun merge(incoming: VisitSnapshot): ImportPreview {
        fun combine(
            current: Map<String, JSONObject>,
            added: Map<String, JSONObject>,
            label: String,
        ): Map<String, JSONObject> {
            val combined = current.toMutableMap()
            for ((id, value) in added) {
                val previous = current[id]
                if (previous != null && canonical(previous) != canonical(value)) {
                    invalid("Ada ID $label yang sama dengan isi berbeda. Impor dibatalkan.")
                }
                combined[id] = previous ?: value
            }
            return combined
        }

        val mergedChildren = combine(children, incoming.children, "anak")
        val mergedVisits = combine(visits, incoming.visits, "kunjungan")
        val preview = ImportPreview(
            VisitSnapshot(selected ?: incoming.selected, mergedChildren, mergedVisits),
            mergedChildren.size - children.size,
            mergedVisits.size - visits.size,
            incoming.children.size,
            incoming.visits.size,
        )
        return preview
    }

    companion object {
        fun fromExport(text: String): VisitSnapshot = try {
            val envelope = JSONObject(text)
            if (envelope.opt("format") != LEGACY_FORMAT || envelope.opt("version") != 1) {
                invalid("Format ekspor HTML tidak didukung.")
            }
            parse(envelope.getJSONObject("data"))
        } catch (e: InvalidVisits) {
            throw e
        } catch (_: Exception) {
            invalid("Berkas ekspor rusak atau tidak dapat dibaca.")
        }

        fun parse(json: JSONObject): VisitSnapshot {
            if (json.opt("version") != 1) invalid("Versi data kunjungan tidak didukung.")
            val children = records(json, "children")
            val visits = records(json, "visits")
            for (child in children.values) validateChild(child)
            for (visit in visits.values) {
                val child = children[visit.text("childId", 100)]
                    ?: invalid("Kunjungan merujuk ke profil anak yang tidak tersedia.")
                validateVisit(visit, child)
            }
            val selected = if (json.isNull("selected")) null else json.text("selected", 100)
            if (selected != null && selected !in visits) invalid("Kunjungan aktif tidak ditemukan.")
            return VisitSnapshot(selected, children, visits)
        }
    }
}

internal data class ImportPreview(
    val merged: VisitSnapshot,
    val addedChildren: Int,
    val addedVisits: Int,
    val totalChildren: Int,
    val totalVisits: Int,
)

private val recordId = Regex("[A-Za-z0-9_.-]{1,100}")
private val datePattern = Regex("[0-9]{4}-[0-9]{2}-[0-9]{2}")
private val kpspAges = setOf(3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 72)
private val denverSectors = setOf("personal-sosial", "motorik-halus", "bahasa", "motorik-kasar")

private fun invalid(message: String): Nothing = throw InvalidVisits(message)

private fun JSONObject.text(key: String, max: Int, optional: Boolean = false): String {
    val value = opt(key)
    if (optional && isNull(key)) return ""
    val text = value as? String ?: invalid("Isian $key memiliki format yang salah.")
    if (text.length > max || (!optional && text.isBlank())) invalid("Isian $key tidak valid.")
    return text
}

private fun readDate(value: String): LocalDate {
    if (!datePattern.matches(value)) invalid("Format tanggal tidak valid.")
    return try {
        LocalDate.parse(value).also { if (it.year !in 100..9999) invalid("Tahun tidak valid.") }
    } catch (_: java.time.format.DateTimeParseException) {
        invalid("Tanggal kalender tidak valid.")
    }
}

private fun records(container: JSONObject, key: String): Map<String, JSONObject> {
    val array = container.optJSONArray(key) ?: invalid("Daftar $key tidak valid.")
    val result = linkedMapOf<String, JSONObject>()
    for (index in 0 until array.length()) {
        val record = array.optJSONObject(index) ?: invalid("Isi daftar $key tidak valid.")
        val id = record.text("id", 100)
        if (!recordId.matches(id) || result.put(id, record) != null) invalid("ID pada $key tidak unik atau tidak valid.")
    }
    return result
}

private fun validateChild(child: JSONObject) {
    child.text("name", 80)
    readDate(child.text("birthDate", 10))
    if (child.text("sex", 1) !in setOf("f", "m")) invalid("Jenis kelamin untuk acuan pertumbuhan tidak valid.")
    if (child.has("isDemo") && child.opt("isDemo") !is Boolean) invalid("Penanda profil demo tidak valid.")
    val vaccines = child.optJSONObject("vaccines") ?: if (child.has("vaccines")) invalid("Data imunisasi tidak valid.") else JSONObject()
    for (key in vaccines.keys()) {
        if (!recordId.matches(key)) invalid("Kode dosis imunisasi tidak valid.")
        readDate(vaccines.text(key, 10))
    }
    child.put("vaccines", vaccines)
    if (!child.has("isDemo")) child.put("isDemo", false)
}

private fun validateVisit(visit: JSONObject, child: JSONObject) {
    if (readDate(visit.text("examDate", 10)).isBefore(readDate(child.text("birthDate", 10)))) {
        invalid("Tanggal pemeriksaan mendahului tanggal lahir.")
    }
    val measures = visit.optJSONObject("measures") ?: invalid("Data pengukuran tidak lengkap.")
    for (key in listOf("weight", "height", "head", "arm")) {
        val value = measures.opt(key)
        if (!measures.has(key) || (!measures.isNull(key) && (value !is Number || !value.toDouble().isFinite() || value.toDouble() <= 0))) {
            invalid("Nilai pengukuran $key tidak valid.")
        }
    }
    val position = measures.opt("position")
    if (position !in setOf("", "length", "height") || (measures.isNull("height") != (position == ""))) {
        invalid("Posisi pengukuran PB/TB tidak sesuai.")
    }
    if (measures.opt("oedema") !is Boolean) invalid("Penanda edema tidak valid.")

    val routines = visit.arrayOrEmpty("routines")
    for (i in 0 until routines.length()) {
        val item = routines.optJSONObject(i) ?: invalid("Rutinitas makan tidak valid.")
        item.text("text", 1000)
        try {
            LocalTime.parse(item.text("time", 8))
        } catch (_: java.time.format.DateTimeParseException) {
            invalid("Jam rutinitas tidak valid.")
        }
    }
    visit.put("routines", routines)
    val referrals = visit.arrayOrEmpty("referrals")
    visit.put("referrals", referrals)
    for (record in records(visit, "referrals").values) {
        record.text("findings", 1800)
        record.text("reason", 700)
        if (record.text("urgency", 40) !in setOf("Terjadwal", "Segera", "Gawat darurat")) invalid("Urgensi ringkasan tidak valid.")
        record.text("destination", 160)
        record.text("unit", 120)
        record.text("actionTaken", 700, optional = true)
        record.text("followUp", 700, optional = true)
    }
    visit.optionalObject("kpsp")?.let(::validateKpsp)
    visit.optionalObject("denver")?.let(::validateDenver)
}

private fun JSONObject.optionalObject(key: String): JSONObject? =
    if (!has(key)) null else optJSONObject(key) ?: invalid("Data $key tidak valid.")

private fun JSONObject.arrayOrEmpty(key: String): JSONArray =
    if (!has(key)) JSONArray() else optJSONArray(key) ?: invalid("Daftar $key tidak valid.")

private fun validateKpsp(kpsp: JSONObject) {
    val stage = kpsp.text("stage", 12)
    if (stage !in setOf("picker", "form", "result")) invalid("Tahap KPSP tidak valid.")
    val selectedAge = kpsp.opt("age")
    if (selectedAge !is Int || selectedAge !in kpspAges) {
        if (stage != "picker" || !kpsp.isNull("age")) invalid("Usia formulir KPSP tidak valid.")
    }
    val drafts = kpsp.optJSONArray("answers") ?: invalid("Jawaban KPSP tidak valid.")
    val usedAges = mutableSetOf<Int>()
    var selectedCount = 0
    for (index in 0 until drafts.length()) {
        val entry = drafts.optJSONArray(index) ?: invalid("Kelompok jawaban KPSP tidak valid.")
        val age = entry.opt(0) as? Int ?: invalid("Usia jawaban KPSP tidak valid.")
        val answers = entry.optJSONObject(1) ?: invalid("Isian KPSP tidak valid.")
        if (entry.length() != 2 || age !in kpspAges || !usedAges.add(age) || answers.length() > 10) {
            invalid("Kelompok jawaban KPSP tidak valid.")
        }
        for (key in answers.keys()) {
            if (!Regex("kpsp-[1-9][0-9]{0,3}").matches(key) || answers.opt(key) !in setOf("ya", "tidak")) {
                invalid("Butir jawaban KPSP tidak valid.")
            }
        }
        if (age == selectedAge) selectedCount = answers.length()
    }
    if (stage == "result" && selectedCount != 10) invalid("Hasil KPSP memerlukan sepuluh jawaban.")
}

private fun validateDenver(denver: JSONObject) {
    readDate(denver.text("birthDate", 10))
    readDate(denver.text("examDate", 10))
    val findings = denver.optJSONArray("findings") ?: invalid("Data rekap Denver II tidak valid.")
    val keys = mutableSetOf<Pair<String, String>>()
    for (i in 0 until findings.length()) {
        val item = findings.optJSONObject(i) ?: invalid("Butir rekap Denver II tidak valid.")
        val sector = item.text("sectorId", 40)
        val name = item.text("item", 160)
        if (sector !in denverSectors || !keys.add(sector to name.trim().lowercase(Locale.ROOT)) ||
            item.opt("response") !in setOf("F", "R") || item.opt("position") !in setOf("delay", "caution")
        ) invalid("Butir rekap Denver II tidak valid.")
    }
}

private fun canonical(value: Any?): String = when (value) {
    is JSONObject -> value.keys().asSequence().sorted().joinToString(",", "{", "}") {
        JSONObject.quote(it) + ":" + canonical(value.opt(it))
    }
    is JSONArray -> (0 until value.length()).joinToString(",", "[", "]") { canonical(value.opt(it)) }
    is Number -> value.toString().toBigDecimal().stripTrailingZeros().toPlainString()
    is Boolean -> value.toString()
    is String -> JSONObject.quote(value)
    else -> "null"
}
