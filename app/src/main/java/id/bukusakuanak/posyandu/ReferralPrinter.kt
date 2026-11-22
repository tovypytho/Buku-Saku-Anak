package id.bukusakuanak.posyandu

import android.content.Context
import android.os.Bundle
import android.os.CancellationSignal
import android.os.ParcelFileDescriptor
import android.print.PageRange
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintManager
import android.text.TextUtils
import android.webkit.WebView
import android.webkit.WebViewClient
import id.bukusakuanak.posyandu.data.InvalidVisits
import id.bukusakuanak.posyandu.data.VisitRepository
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

internal class ReferralPrinter(
    private val context: Context,
    private val repository: VisitRepository,
) {
    private var activeView: WebView? = null

    suspend fun print(visitId: String, recordId: String) {
        if (activeView != null) throw InvalidVisits("Selesaikan cetakan yang sedang dibuka.")
        val snapshot = repository.load().snapshot
        val visit = snapshot.visits[visitId] ?: throw InvalidVisits("Kunjungan tidak ditemukan.")
        val child = snapshot.children.getValue(visit.getString("childId"))
        val date = LocalDate.parse(visit.getString("examDate"))
        val birth = LocalDate.parse(child.getString("birthDate"))
        if (!date.isBefore(birth.plusYears(18))) throw InvalidVisits("Ringkasan tersedia untuk kunjungan anak.")
        val records = visit.optJSONArray("referrals") ?: throw InvalidVisits("Ringkasan belum tersimpan.")
        val record = (0 until records.length()).asSequence().map(records::getJSONObject)
            .firstOrNull { it.getString("id") == recordId } ?: throw InvalidVisits("Ringkasan belum tersimpan.")
        val format = DateTimeFormatter.ofPattern("d MMMM uuuu", Locale.forLanguageTag("id-ID"))
        val fields = listOf(
            "Kode anak" to child.getString("name"),
            "Tanggal lahir" to birth.format(format),
            "Tanggal pemeriksaan" to date.format(format),
            "Temuan" to record.getString("findings"),
            "Alasan" to record.getString("reason"),
            "Urgensi" to record.getString("urgency"),
            "Tindakan awal" to record.optString("actionTaken"),
            "Fasilitas tujuan" to record.getString("destination"),
            "Unit tujuan" to record.getString("unit"),
            "Tindak lanjut" to record.optString("followUp"),
        )
        val entries = fields.filter { it.second.isNotBlank() }.joinToString("") { (label, text) ->
            "<dt>${TextUtils.htmlEncode(label)}</dt><dd>${TextUtils.htmlEncode(text)}</dd>"
        }
        val html = """
            <!doctype html><html lang="id"><meta charset="utf-8">
            <style>body{font:11pt/1.45 sans-serif;color:#151515}h1{font-size:21pt;margin:0}
            dt{font-weight:bold;break-after:avoid}dd{margin:0 0 .65rem;white-space:pre-wrap;overflow-wrap:anywhere}</style>
            <h1>Ringkasan serah terima</h1><p>Buku Saku Anak · Prototipe offline</p>
            <dl>$entries</dl><p>Proses rujukan resmi mengikuti SOP fasilitas.</p></html>
        """.trimIndent()
        val manager = context.getSystemService(PrintManager::class.java)
            ?: throw InvalidVisits("Layanan cetak Android tidak tersedia.")
        val viewer = WebView(context)
        activeView = viewer
        viewer.webViewClient = object : WebViewClient() {
            var started = false

            override fun onPageFinished(view: WebView, url: String) {
                if (started) return
                started = true
                val inner = view.createPrintDocumentAdapter("Ringkasan Buku Saku Anak")
                val adapter = object : PrintDocumentAdapter() {
                    override fun onStart() = inner.onStart()

                    override fun onLayout(
                        oldAttributes: PrintAttributes?,
                        newAttributes: PrintAttributes?,
                        cancellationSignal: CancellationSignal?,
                        callback: LayoutResultCallback?,
                        extras: Bundle?,
                    ) = inner.onLayout(oldAttributes, newAttributes, cancellationSignal, callback, extras)

                    override fun onWrite(
                        pages: Array<PageRange>?,
                        destination: ParcelFileDescriptor?,
                        cancellationSignal: CancellationSignal?,
                        callback: WriteResultCallback?,
                    ) = inner.onWrite(pages, destination, cancellationSignal, callback)

                    override fun onFinish() {
                        inner.onFinish()
                        activeView = null
                        view.destroy()
                    }
                }
                val attributes = PrintAttributes.Builder()
                    .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                    .setMinMargins(PrintAttributes.Margins(600, 600, 600, 600))
                    .build()
                try {
                    manager.print("Ringkasan Buku Saku Anak", adapter, attributes)
                } catch (_: IllegalStateException) {
                    activeView = null
                    view.destroy()
                    android.widget.Toast.makeText(context, "Layanan cetak tidak dapat dibuka.", android.widget.Toast.LENGTH_SHORT).show()
                }
            }
        }
        viewer.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null)
    }
}
