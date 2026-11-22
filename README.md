# Buku Saku Anak 1.0.1

Prototipe Android Kotlin untuk alur kunjungan Posyandu. Antarmuka berasal dari HTML Buku Saku Anak terbaru. Pemeriksaan, pencarian artikel, dan penyimpanan kunjungan berjalan di perangkat. Gunakan data fiktif untuk demo.

## Build dari source

Gunakan JDK 17 atau 21 dan Android SDK Platform 36. Aplikasi menargetkan SDK 36 dengan versi minimum Android 8 dan memerlukan Android System WebView yang mendukung Web Message Listener. Gradle Wrapper mengunduh Gradle serta dependensi pada build pertama.

```powershell
.\gradlew.bat :app:testDebugUnitTest :app:lintDebug :app:assembleDebug --max-workers=2
node --test tests/*.test.cjs
```

Di Linux atau macOS, gunakan `./gradlew`. APK debug ada di `app/build/outputs/apk/debug/app-debug.apk`. Build ini memakai tanda tangan debug.

## Pasang dan debug lewat ADB

Aktifkan USB debugging di pengaturan pengembang ponsel, hubungkan USB, dan konfirmasi izin debugging pada HP. Root tidak diperlukan.

```powershell
adb devices -l
adb install -r "app/build/outputs/apk/debug/app-debug.apk"
adb shell am start -n id.bukusakuanak.posyandu/.MainActivity
adb logcat -s AndroidRuntime chromium
```

Jika dua HP terhubung, tambahkan `-s SERIAL` setelah `adb` untuk tiap perintah yang mengarah ke perangkat. Untuk melihat HTML dan JavaScript, buka `chrome://inspect/#devices` di Chrome desktop saat aplikasi debug sedang terbuka. APK debug dari komputer berbeda atau GitHub Actions dapat memiliki tanda tangan berbeda. Gunakan build dengan tanda tangan yang sama untuk memperbarui instalasi sambil mempertahankan data.

## Coba alur offline

1. Buka **Beranda → Coba profil Nara** atau buat profil fiktif baru. Masukkan BB, PB/TB, lingkar kepala, dan LiLA di kunjungan.
2. Periksa kurva di **Pertumbuhan**. Isi beberapa jawaban KPSP lalu buka kembali kunjungan itu. Isi dan selesaikan rekap Denver II berdasarkan data simulasi. Ubah tanggal kunjungan untuk melihat permintaan pemeriksaan ulang rekap.
3. Buka **Panduan**. Cari *pupil putih* atau pilih **Ibu hamil & nifas**. Dari kunjungan anak, buat **Ringkasan serah terima** dan pilih **Simpan & cetak**. Dialog sistem menawarkan printer yang tersedia atau **Simpan sebagai PDF**.
4. Untuk migrasi, buka HTML lama pada alamat file yang biasa dipakai di browser yang menyimpan riwayat. Pilih **Sumber → Ekspor untuk Android**. Di Android pilih **Sumber → Impor riwayat HTML**, pilih JSON, tinjau jumlah rekaman, lalu konfirmasi. `fixtures/riwayat-html-fiktif.json` adalah contoh yang dapat langsung dipakai.
5. Data impor yang identik dilewati. Jika ID sama berisi perubahan yang berbeda, aplikasi meminta penyelesaian konflik sebelum impor. Simpan berkas ekspor secara aman karena JSON berisi isi riwayat.

## Struktur proyek

- `app/src/main/assets/www` berisi tampilan, logika pemeriksaan, data referensi, dan aset offline. `domain.js` menjalankan kalkulasi umur, WHO, kategori KPSP, dan rekap Denver II. `native-store.js` menangani antrean penyimpanan dan pesan ke Activity.
- Kotlin di `app/src/main/java` menangani WebView lokal, pemilihan file, validasi, Room/SQLite, dan cetak. Database memisahkan profil anak dan kunjungan dengan relasi untuk menjaga keterkaitan. Skema Room ada di `app/schemas`.
- `tests` dan `app/src/test` berisi pemeriksaan tanpa perangkat. `fixtures` berisi data fiktif.

## Google AI Studio dan GitHub Actions

Akar ZIP memuat `settings.gradle.kts`, Gradle Wrapper, dan satu modul `app`. Setelah repo diunggah, gunakan **Build → Import from GitHub** bila tersedia untuk proyek Android pada akunmu. Android Studio atau Gradle Wrapper membuka source hasil ekstraksi langsung. Google AI Studio mendokumentasikan ZIP sebagai format unduhan Android. Uji impor dan preview baru bisa dikonfirmasi setelah proyek benar-benar dibuka di AI Studio.

Workflow **Build APK Android** dapat dijalankan manual di GitHub Actions setelah folder ini menjadi akar repositori. Workflow membangun APK debug dan menyediakannya di bagian **Artifacts**. Persiapan source code dan verifikasi lokal tidak mengunggah proyek.

## Status penggunaan

V1 adalah prototipe lokal untuk demo. Telaah klinis, pemeriksaan izin distribusi konten, dan pengelolaan akses serta data bersama Puskesmas diperlukan sebelum pilot. Rujukan tercantum di tiap artikel. Lihat [aset dan sumber](ASSETS.md) serta [hasil pemeriksaan](VERIFIKASI.md).
