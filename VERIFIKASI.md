# Verifikasi Buku Saku Anak 1.0.0

## Build dan pengujian

- Build debug dan build APK instrumentation dengan Gradle 8.13, JDK 21, serta Android SDK 36 pada Windows.
- Lint Android selesai tanpa error. Empat tes JVM mencakup validasi, kesalahan tanggal, impor ulang, benturan ID, serta KPSP belum lengkap.
- Sembilan pemeriksaan Node.js untuk kalkulasi, antrean penyimpanan, paket aset dan kontrak WebView. Jalankan dengan `node --test tests/*.test.cjs`.
- APK debug diverifikasi menggunakan `apksigner`. Paket menargetkan SDK 36, menetapkan SDK minimum 26, dan menyediakan ABI ARM serta x86.
- Pada Vivo 1904 Android 11, aplikasi berhasil dipasang dan dijalankan lewat ADB. Uji alur mencakup kurva pertumbuhan, KPSP, rekap Denver II, Panduan, dua kunjungan fiktif, serta pemulihan hasil setelah aplikasi ditutup paksa. Perubahan tanggal memunculkan peninjauan ulang rekap yang tersimpan.
- Fitur **Simpan & cetak** diuji melalui Print Framework pada Vivo. PDF satu halaman A4 yang dihasilkan berisi ringkasan fiktif yang dipilih.
- Impor melalui pemilih berkas Vivo menambahkan dua profil dan dua kunjungan fiktif. Draf KPSP ikut terbaca dan hasil impor tetap ada setelah aplikasi dibuka kembali.
- Satu tes Room berjalan di Vivo dan lulus. Transaksi menolak revisi usang serta relasi anak yang tidak valid, lalu riwayat sebelumnya tetap terbaca.
- Source dibangun ulang dari ZIP yang diekstraksi ke folder baru. Build APK debug, lint, tes JVM, dan tes Node.js lulus dari hasil ekstraksi.

SHA-256 APK debug yang diserahkan

```text
806e23daf073b243e50f205efe647449b2c81f3356f8e728b442ec67c31ad6a3
```

## Batas verifikasi

Uji Android menggunakan ponsel terhubung dan pemeriksaan build tanpa Android Studio atau emulator. Android 15, impor dan preview di Google AI Studio, serta workflow di GitHub Actions menunggu pengujian pada lingkungan masing-masing. Uji klinis dan kesiapan pilot memerlukan pemeriksaan oleh Puskesmas.
