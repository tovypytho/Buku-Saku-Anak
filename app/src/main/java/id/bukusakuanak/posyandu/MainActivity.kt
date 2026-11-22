package id.bukusakuanak.posyandu

import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import id.bukusakuanak.posyandu.data.InvalidVisits
import id.bukusakuanak.posyandu.data.MAX_TRANSFER_BYTES
import id.bukusakuanak.posyandu.data.VisitRepository
import id.bukusakuanak.posyandu.data.VisitSnapshot
import id.bukusakuanak.posyandu.data.visitDatabase
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.ByteArrayOutputStream

private const val ASSET_HOST = "appassets.androidplatform.net"
private const val ASSET_ORIGIN = "https://$ASSET_HOST"
private const val START_PAGE = "$ASSET_ORIGIN/assets/www/index.html"

class MainActivity : ComponentActivity() {
    private val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val repository by lazy { VisitRepository(visitDatabase(applicationContext)) }
    private val printer by lazy { ReferralPrinter(this, repository) }
    private var page: WebView? = null
    private var importReply: ((JSONObject) -> Unit)? = null

    private val importFile = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri == null) finishImport(JSONObject().put("cancelled", true))
        else applicationScope.launch { previewImport(uri) }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WebView.setWebContentsDebuggingEnabled(applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0)
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                page?.evaluateJavascript("window.bukuSakuBack?.() === true") {
                    if (it != "true") moveTaskToBack(true)
                } ?: moveTaskToBack(true)
            }
        })
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = Color(0xfff7f1e8)) {
                    AndroidView(
                        factory = { createPage().also { page = it } },
                        modifier = Modifier.fillMaxSize().safeDrawingPadding(),
                    )
                }
            }
        }
    }

    private fun createPage(): WebView {
        val assets = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
        return WebView(this).apply {
            // JavaScript is required for the packaged interface and is restricted to bundled pages.
            @Suppress("SetJavaScriptEnabled")
            settings.javaScriptEnabled = true
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.domStorageEnabled = false
            settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW
            webChromeClient = android.webkit.WebChromeClient()
            webViewClient = object : WebViewClientCompat() {
                override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                    if (request.url.scheme == "data") return null
                    return assets.shouldInterceptRequest(request.url)
                        ?: WebResourceResponse("text/plain", "UTF-8", 403, "Blocked", emptyMap(), null)
                }

                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val url = request.url
                    if (url.toString() == START_PAGE) return false
                    if (request.isForMainFrame && request.hasGesture() && url.scheme == "https" &&
                        url.host != ASSET_HOST && !url.host.isNullOrEmpty()
                    ) {
                        try {
                            startActivity(Intent(Intent.ACTION_VIEW, url))
                        } catch (_: ActivityNotFoundException) {
                            Toast.makeText(this@MainActivity, "Browser tidak tersedia.", Toast.LENGTH_SHORT).show()
                        }
                    }
                    return true
                }
            }
            if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
                loadData(
                    "<meta name='viewport' content='width=device-width, initial-scale=1'><p>Perbarui Android System WebView sebelum membuka Buku Saku Anak.</p>",
                    "text/html",
                    "UTF-8",
                )
                return@apply
            }
            WebViewCompat.addWebMessageListener(this, "BukuSakuNative", setOf(ASSET_ORIGIN)) { _, message, origin, main, reply ->
                if (!main || origin.toString().trimEnd('/') != ASSET_ORIGIN) return@addWebMessageListener
                val raw = message.data ?: return@addWebMessageListener
                applicationScope.launch { handleMessage(raw, reply::postMessage) }
            }
            loadUrl(START_PAGE)
        }
    }

    private suspend fun handleMessage(raw: String, respond: (String) -> Unit) {
        var id = 0
        fun success(value: JSONObject) {
            respond(JSONObject().put("id", id).put("result", value).toString())
        }
        try {
            val request = JSONObject(raw)
            id = request.getInt("id")
            if (raw.length > MAX_TRANSFER_BYTES) throw InvalidVisits("Data terlalu besar untuk disimpan.")
            val args = request.optJSONObject("args") ?: JSONObject()
            when (request.getString("action")) {
                "load" -> success(repository.load().json())
                "save" -> {
                    if (importReply != null) throw InvalidVisits("Selesaikan impor sebelum menyimpan perubahan.")
                    val saved = repository.save(args.getJSONObject("state"), args.getLong("revision"))
                    success(JSONObject().put("revision", saved.revision))
                }
                "import" -> {
                    if (importReply != null) throw InvalidVisits("Impor sedang dibuka.")
                    importReply = ::success
                    try {
                        // Some Android document providers assign their own MIME type to JSON.
                        // Parse and validate the selected file before showing a preview.
                        importFile.launch(arrayOf("*/*"))
                    } catch (_: ActivityNotFoundException) {
                        importReply = null
                        throw InvalidVisits("Pemilih berkas tidak tersedia.")
                    }
                }
                "print" -> {
                    printer.print(args.getString("visitId"), args.getString("recordId"))
                    success(JSONObject())
                }
                else -> throw InvalidVisits("Perintah aplikasi tidak dikenal.")
            }
        } catch (error: Exception) {
            if (error is CancellationException) throw error
            respond(JSONObject().put("id", id).put("error", userMessage(error)).toString())
        }
    }

    private fun userMessage(error: Exception): String = if (error is InvalidVisits) {
        error.message ?: "Data tidak valid."
    } else {
        "Tindakan gagal. Coba lagi."
    }

    private suspend fun previewImport(uri: Uri) {
        try {
            val incoming = withContext(Dispatchers.IO) {
                val data = contentResolver.openInputStream(uri)?.use { input ->
                    val buffer = ByteArray(8192)
                    val output = ByteArrayOutputStream()
                    while (true) {
                        val count = input.read(buffer)
                        if (count == -1) break
                        if (output.size() + count > MAX_TRANSFER_BYTES) throw InvalidVisits("Berkas melebihi 8 MB.")
                        output.write(buffer, 0, count)
                    }
                    output.toString(Charsets.UTF_8.name()).removePrefix("\uFEFF")
                } ?: throw InvalidVisits("Berkas tidak dapat dibuka.")
                VisitSnapshot.fromExport(data)
            }
            val preview = repository.previewImport(incoming)
            val duplicateVisits = preview.totalVisits - preview.addedVisits
            val message = "${preview.totalChildren} profil dan ${preview.totalVisits} kunjungan ditemukan.\n" +
                "${preview.addedChildren} profil dan ${preview.addedVisits} kunjungan baru. " +
                "$duplicateVisits kunjungan identik akan dilewati."
            android.app.AlertDialog.Builder(this)
                .setTitle("Impor riwayat HTML")
                .setMessage(message)
                .setNegativeButton("Batal") { _, _ -> finishImport(JSONObject().put("cancelled", true)) }
                .setOnCancelListener { finishImport(JSONObject().put("cancelled", true)) }
                .setPositiveButton("Impor") { _, _ ->
                    applicationScope.launch {
                        try {
                            val saved = repository.import(incoming)
                            finishImport(saved.json().put("addedVisits", preview.addedVisits))
                        } catch (error: Exception) {
                            if (error is CancellationException) throw error
                            finishImport(JSONObject().put("importError", userMessage(error)))
                        }
                    }
                }
                .show()
        } catch (error: Exception) {
            if (error is CancellationException) throw error
            finishImport(JSONObject().put("importError", userMessage(error)))
        }
    }

    private fun finishImport(result: JSONObject) {
        val reply = importReply
        importReply = null
        reply?.invoke(result)
    }

    override fun onDestroy() {
        applicationScope.cancel()
        importReply = null
        super.onDestroy()
        page?.destroy()
        page = null
    }
}
