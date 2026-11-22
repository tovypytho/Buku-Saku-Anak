package id.bukusakuanak.posyandu.data

import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class VisitSnapshotTest {
    private fun child() = JSONObject("""{"id":"c","name":"DEMO","birthDate":"2024-02-29","sex":"f"}""")

    private fun visit() = JSONObject(
        """{"id":"v","childId":"c","examDate":"2024-11-29","measures":{"weight":8.5,"height":null,"head":null,"arm":null,"position":"","oedema":false}}"""
    )

    private fun state(child: JSONObject = child(), visit: JSONObject = visit()) = JSONObject()
        .put("version", 1).put("selected", "v")
        .put("children", JSONArray().put(child)).put("visits", JSONArray().put(visit))

    @Test
    fun identicalImportIsIdempotentAndNormalizesLegacyDefaults() {
        val initial = VisitSnapshot.parse(state())
        val envelope = JSONObject().put("format", LEGACY_FORMAT).put("version", 1).put("data", state())
        val imported = VisitSnapshot.fromExport(envelope.toString())
        val preview = initial.merge(imported)
        assertEquals(0, preview.addedVisits)
        assertEquals(0, preview.addedChildren)
        assertEquals("v", preview.merged.selected)
        assertEquals(0, preview.merged.visits.getValue("v").getJSONArray("referrals").length())
    }

    @Test
    fun collisionsAndBrokenRelationshipsAreRejected() {
        val original = VisitSnapshot.parse(state())
        val changed = VisitSnapshot.parse(state(child().put("name", "DEMO BARU")))
        assertThrows(InvalidVisits::class.java) { original.merge(changed) }
        assertThrows(InvalidVisits::class.java) { VisitSnapshot.parse(state(visit = visit().put("childId", "missing"))) }
        assertThrows(InvalidVisits::class.java) { VisitSnapshot.fromExport("{broken") }
        assertThrows(InvalidVisits::class.java) { VisitSnapshot.parse(state(visit = visit().put("examDate", "2024-02-28"))) }
    }

    @Test
    fun completedDenverIsSavedWithItsOriginalDates() {
        val denver = JSONObject("""{"version":1,"birthDate":"2024-02-29","examDate":"2024-11-29","findings":[
          {"item":"Butir demo","sectorId":"bahasa","response":"F","position":"delay"}]}""")
        val entry = visit().put("denver", denver).put("examDate", "2024-12-02")
        val result = VisitSnapshot.parse(state(visit = entry))
        assertEquals("2024-11-29", result.visits.getValue("v").getJSONObject("denver").getString("examDate"))
    }

    @Test
    fun aFinishedKpspRequiresTenAnswers() {
        val incomplete = JSONObject("""{"stage":"result","age":9,"answers":[[9,{"kpsp-1":"ya"}]]}""")
        assertThrows(InvalidVisits::class.java) { VisitSnapshot.parse(state(visit = visit().put("kpsp", incomplete))) }
        incomplete.put("stage", "form")
        assertEquals("form", VisitSnapshot.parse(state(visit = visit().put("kpsp", incomplete)))
            .visits.getValue("v").getJSONObject("kpsp").getString("stage"))
    }
}
