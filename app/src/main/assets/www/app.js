    const DEMO_PROFILE = { isDemo: true, name: 'Nara', birthDate: '2026-01-15', examDate: '2026-10-15' };

    // Pixel coordinates measured on the embedded UMS sheet (2905 × 4096).
    // The two printed rulers have small independent offsets, even on the straightened scan.
    const DENVER_SHEET_CALIBRATION = {
      id: 'ums-denver-ii-scan-2905x4096-v1',
      width: 2905,
      height: 4096,
      topY: 315,
      bottomY: 3884,
      // [calendar months, x at top, x at bottom]; birth and 6 years use the frame edges.
      ticks: [
        [0, 113, 113],
        [2, 325, 331],
        [4, 532, 538],
        [6, 740, 745],
        [9, 967, 972],
        [12, 1195, 1200],
        [15, 1424, 1429],
        [18, 1619, 1623],
        [24, 1826, 1831],
        [36, 2041, 2045],
        [48, 2264, 2267],
        [60, 2487, 2490],
        [72, 2732, 2732],
      ],
    };

    const SECTORS = [
      { id: 'personal-sosial', code: 'PS', label: 'Personal sosial', yCenterPct: 22 },
      { id: 'motorik-halus', code: 'MH', label: 'Motorik halus adaptif', yCenterPct: 42 },
      { id: 'bahasa', code: 'B', label: 'Bahasa', yCenterPct: 63 },
      { id: 'motorik-kasar', code: 'MK', label: 'Motorik kasar', yCenterPct: 82 }
    ];

    // Measured bounds on DENVER_SHEET_CALIBRATION's exact image. These are scan
    // annotations for the viewer, not clinical percentile or scoring data.
    const MAPPED_SHEET_ITEMS = [
      { id: 'ps-daag', sectorId: 'personal-sosial', name: 'Melambaikan tangan (daag-daag)', left: 791, right: 1312, green: 990, top: 1210, bottom: 1268 },
      { id: 'ps-tepuk', sectorId: 'personal-sosial', name: 'Tepuk tangan', left: 804, right: 1138, green: 1052, top: 1322, bottom: 1379 },
      { id: 'mh-kubus', sectorId: 'motorik-halus', name: 'Membenturkan 2 kubus', left: 824, right: 1123, green: 1051, top: 1506, bottom: 1563 },
      { id: 'mh-ambil', sectorId: 'motorik-halus', name: 'Mengambil 2 kubus', left: 734, right: 1005, green: 852, top: 1618, bottom: 1674 },
      { id: 'b-oceh', sectorId: 'bahasa', name: 'Mengoceh', left: 737, right: 1210, green: 923, top: 2541, bottom: 2598 },
      { id: 'b-silabel', sectorId: 'bahasa', name: 'Kombinasi silabel', left: 751, right: 1078, green: 874, top: 2598, bottom: 2653 },
      { id: 'mk-duduk', sectorId: 'motorik-kasar', name: 'Bangkit terus duduk', left: 881, right: 1055, green: 987, top: 2947, bottom: 3026 },
      { id: 'mk-berdiri', sectorId: 'motorik-kasar', name: 'Bangkit untuk berdiri', left: 893, right: 1026, green: 983, top: 3027, bottom: 3118 },
      { id: 'ps-tangan', sectorId: 'personal-sosial', name: 'Mengamati tangannya', left: 229, right: 533, green: 445, top: 1486, bottom: 1540 },
      { id: 'mh-180', sectorId: 'motorik-halus', name: 'Mengikuti 180°', left: 365, right: 607, green: 540, top: 1948, bottom: 2004 },
      { id: 'b-tertawa', sectorId: 'bahasa', name: 'Tertawa', left: 253, right: 465, green: 389, top: 3000, bottom: 3056 },
      { id: 'mk-dada', sectorId: 'motorik-kasar', name: 'Dada terangkat menumpu pada lengan', left: 381, right: 651, green: 540, top: 3401, bottom: 3459 },
      { id: 'ps-cuci', sectorId: 'personal-sosial', name: 'Cuci dan mengeringkan tangan', left: 1648, right: 2057, green: 1863, top: 655, bottom: 713 },
      { id: 'ps-permainan', sectorId: 'personal-sosial', name: 'Bermain ular tangga atau kartu', left: 1974, right: 2455, green: 2301, top: 433, bottom: 489 },
      { id: 'ps-makan', sectorId: 'personal-sosial', name: 'Mengambil makan', left: 2022, right: 2504, green: 2335, top: 332, bottom: 377 },
      { id: 'mh-vertikal', sectorId: 'motorik-halus', name: 'Meniru garis vertikal', left: 1845, right: 2103, green: 2006, top: 1123, bottom: 1177 },
      { id: 'mh-garis', sectorId: 'motorik-halus', name: 'Memilih garis yang lebih panjang', left: 2035, right: 2551, green: 2266, top: 788, bottom: 843 },
      { id: 'mh-orang', sectorId: 'motorik-halus', name: 'Menggambar orang 6 bagian', left: 2294, right: 2629, green: 2517, top: 675, bottom: 731 },
      { id: 'b-dimengerti', sectorId: 'bahasa', name: 'Bicara semua dimengerti', left: 1800, right: 2345, green: 2121, top: 1430, bottom: 1487 },
      { id: 'b-warna', sectorId: 'bahasa', name: 'Menyebutkan 4 warna', left: 2045, right: 2437, green: 2263, top: 1321, bottom: 1376 },
      { id: 'b-sifat', sectorId: 'bahasa', name: 'Mengetahui 3 kata sifat', left: 2017, right: 2577, green: 2242, top: 1210, bottom: 1264 },
      { id: 'mk-kaki1', sectorId: 'motorik-kasar', name: 'Berdiri 1 kaki 1 detik', left: 1892, right: 2131, green: 2004, top: 2281, bottom: 2337 },
      { id: 'mk-kaki3', sectorId: 'motorik-kasar', name: 'Berdiri 1 kaki 3 detik', left: 1998, right: 2425, green: 2242, top: 2114, bottom: 2169 },
      { id: 'mk-kaki5', sectorId: 'motorik-kasar', name: 'Berdiri 1 kaki 5 detik', left: 2228, right: 2608, green: 2467, top: 2002, bottom: 2059 },
    ];

    const SCAN_EDGE_TOLERANCE_PX = 5;

    const STIMULATION_DOMAINS = {
      kasar: 'Gerak kasar',
      halus: 'Gerak halus',
      bahasa: 'Bicara dan bahasa',
      sosial: 'Sosial dan kemandirian'
    };

    // Contoh kegiatan rumah diadaptasi dari Buku KIA 2024 dan materi SDIDTK.
    const STIMULATION_GROUPS = [
      {
        fromMonth: 0, label: '0–2 bulan',
        activities: {
          kasar: [
            'Saat bayi terjaga dan tenang, ajak bermain tengkurap sebentar di alas rata sambil diawasi langsung.',
            'Saat bayi telentang dan terjaga, beri ruang agar tangan dan kakinya dapat bergerak bebas.'
          ],
          halus: [
            'Tunjukkan mainan berwarna kontras dan gerakkan perlahan agar bayi dapat memperhatikan.',
            'Tawarkan jari yang bersih saat tangan bayi terbuka dan biarkan ia menggenggam bila mau.'
          ],
          bahasa: [
            'Bicara lembut saat mengganti popok atau menggendong bayi.',
            'Tanggapi suara bayi dengan suara lembut, lalu beri jeda untuk mendengar responsnya.'
          ],
          sosial: [
            'Saat bayi tenang, dekatkan wajah dan tersenyumlah ketika ia menatap.',
            'Dekap dan tenangkan bayi ketika ia mulai gelisah. Beri jeda bermain bila ia berpaling atau lelah.'
          ]
        }
      },
      {
        fromMonth: 3, label: '3–5 bulan',
        activities: {
          kasar: [
            'Saat bayi terjaga dan tengkurap dengan pengawasan, letakkan wajah Anda di depannya agar ia tertarik mengangkat kepala.',
            'Letakkan mainan ke salah satu sisi saat bayi telentang dan beri ia kesempatan mencoba berguling.'
          ],
          halus: [
            'Tawarkan mainan ringan bergagang lebar dalam jangkauan, lalu biarkan bayi mencoba meraih dan menggenggamnya.',
            'Geser mainan dari dekat tengah tubuh ke samping agar bayi dapat mencoba meraih dari arah berbeda.'
          ],
          bahasa: [
            'Tiru ocehan bayi dan tunggu beberapa saat untuk bergantian bersuara.',
            'Bernyanyi atau panggil namanya dari satu sisi agar ia dapat mencoba mencari arah suara.'
          ],
          sosial: [
            'Mainkan cilukba dengan menutup wajah Anda menggunakan telapak tangan, lalu munculkan senyum.',
            'Lihat cermin yang aman bersama bayi dan tanggapi ekspresi yang ia tunjukkan.'
          ]
        }
      },
      {
        fromMonth: 6, label: '6–8 bulan',
        activities: {
          kasar: [
            'Ajak bayi bermain di lantai dan letakkan mainan kesukaannya agak ke samping agar ia mencoba meraihnya.',
            'Saat bayi mulai bisa duduk, bermainlah dekat dengannya di alas datar sambil menjaga agar ia tidak jatuh.'
          ],
          halus: [
            'Berikan balok bayi yang cukup besar untuk digenggam dan biarkan ia memindahkannya dari satu tangan ke tangan lain.',
            'Contohkan cara mengetukkan dua mainan ringan yang aman, lalu biarkan bayi mencoba.'
          ],
          bahasa: [
            'Saat melihat buku bergambar, tunjuk satu gambar dan sebutkan namanya dengan jelas.',
            'Panggil nama bayi saat mengajaknya berinteraksi dan tanggapi saat ia menoleh atau bersuara.'
          ],
          sosial: [
            'Ajak tepuk tangan sambil bernyanyi. Tunjukkan gerakannya dan beri waktu untuk meniru.',
            'Bermain cilukba secara bergantian di depan bayi. Ulangi saat ia tampak menikmati permainan.'
          ]
        }
      },
      {
        fromMonth: 9, label: '9–11 bulan',
        activities: {
          kasar: [
            'Letakkan mainan di lantai dalam jangkauan bayi, lalu geser sedikit agar ia tertarik bergerak mendekat.',
            'Jika bayi sudah mulai menarik badan untuk berdiri, dampingi saat ia berpegangan pada perabot yang kokoh.'
          ],
          halus: [
            'Contohkan cara memasukkan balok besar ke wadah lebar, lalu biarkan bayi mengambil dan memasukkannya kembali.',
            'Berikan dua mainan berukuran aman agar bayi bisa mencoba memegang satu di tiap tangan.'
          ],
          bahasa: [
            'Ajak bayi melihat buku bergambar. Tunjuk dan namai benda yang ia lihat atau sentuh.',
            'Gunakan boneka untuk menyapa. Balas ocehan bayi seolah sedang bercakap-cakap.'
          ],
          sosial: [
            'Contohkan lambaian tangan ketika seseorang berpamitan dan beri bayi kesempatan ikut melambai.',
            'Sembunyikan sebagian mainan di balik kain saat bermain bersama dan ajak bayi menemukannya.'
          ]
        }
      },
      {
        fromMonth: 12, label: '12–17 bulan',
        activities: {
          kasar: [
            'Jika anak sudah mulai melangkah, ajak berjalan beberapa langkah menuju Anda di lantai yang bebas rintangan.',
            'Duduk berhadapan di lantai dan gulirkan bola lunak pelan agar anak bisa mengembalikannya.'
          ],
          halus: [
            'Tumpuk dua balok besar sebagai contoh, kemudian beri anak waktu untuk mencoba sendiri.',
            'Tawarkan krayon tebal yang aman dan kertas agar anak bebas membuat coretan dengan pendampingan.'
          ],
          bahasa: [
            'Tunjuk gambar hewan di buku, sebutkan namanya, lalu beri waktu anak untuk meniru bunyinya.',
            'Saat berpakaian, ucapkan nama benda yang dipakai, seperti baju atau sepatu.'
          ],
          sosial: [
            'Ajak anak memasukkan satu mainan ke keranjang saat selesai bermain. Lakukan bersama agar ia melihat caranya.',
            'Saat makan bersama, beri anak kesempatan mencoba menggunakan sendoknya sendiri.'
          ]
        }
      },
      {
        fromMonth: 18, label: '18–23 bulan',
        activities: {
          kasar: [
            'Ajak anak menendang bola lunak ke arah keranjang di ruang yang lapang.',
            'Jika anak sudah mantap berjalan, dampingi saat ia naik turun satu anak tangga rendah sambil berpegangan.'
          ],
          halus: [
            'Gunakan puzzle sederhana dengan kepingan besar. Tunjukkan cara memutar kepingan agar pas.',
            'Buat jalan dengan balok besar dan ajak anak menambahkan baloknya sendiri.'
          ],
          bahasa: [
            'Mainkan telepon pura-pura. Ajak anak menyapa dan bergantian menyebut siapa yang sedang ditelepon.',
            'Berikan arahan singkat seperti “Tolong ambil bolanya”, lalu beri waktu untuk merespons.'
          ],
          sosial: [
            'Saat berganti pakaian, beri kesempatan anak menarik lepas kaus kaki dan bantu bila ia kesulitan.',
            'Ajak anak ikut merapikan mainan. Pilih satu tempat yang dapat ia jangkau sendiri.'
          ]
        }
      },
      {
        fromMonth: 24, label: '2 tahun',
        activities: {
          kasar: [
            'Gulirkan atau lempar pelan bola lunak dari jarak dekat dan ajak anak mencoba menangkapnya.',
            'Ajak anak berlari pelan atau melompat dengan dua kaki di area datar yang bebas rintangan, sesuai kesiapan.'
          ],
          halus: [
            'Ajak anak memilih balok berdasarkan warna atau bentuk dan meletakkannya di dua wadah berbeda.',
            'Tunjukkan cara membuat coretan garis di kertas dengan krayon tebal, lalu biarkan anak mencoba bentuknya sendiri.'
          ],
          bahasa: [
            'Sebutkan fungsi benda yang dikenal, misalnya gelas untuk minum, lalu ajak anak mencari bendanya.',
            'Saat membaca bersama, minta anak menunjuk gambar yang disebut dan tanggapi kata-katanya.'
          ],
          sosial: [
            'Ajak anak mencuci tangan bersama sebelum makan. Contohkan urutannya dan bantu saat diperlukan.',
            'Saat makan, beri anak waktu berlatih memakai sendok sendiri.'
          ]
        }
      },
      {
        fromMonth: 36, label: '3 tahun',
        activities: {
          kasar: [
            'Ajak anak melompat melewati garis yang digambar di lantai. Mulai dengan jarak yang terasa nyaman baginya.',
            'Berdiri berhadapan dan lempar bola lunak pelan dari jarak dekat. Bergantian melempar dan menangkap.'
          ],
          halus: [
            'Gambar bentuk sederhana bersama anak, lalu biarkan ia menambahkan garis atau bentuk lain.',
            'Ajak anak menyusun puzzle gambar berkeping besar dan bantu melihat bagian yang cocok bila diminta.'
          ],
          bahasa: [
            'Baca cerita singkat dan ajak anak memilih gambar yang ia suka. Tanyakan apa yang sedang terjadi di gambar itu.',
            'Minta anak bercerita tentang sesuatu yang baru ia lakukan. Dengarkan dan ajukan satu pertanyaan lanjutan.'
          ],
          sosial: [
            'Bermain bergiliran dengan bola atau balok. Ucapkan giliran masing-masing agar anak mudah mengikuti.',
            'Beri kesempatan anak memakai bajunya sendiri. Tawarkan bantuan untuk bagian yang masih sulit.'
          ]
        }
      },
      {
        fromMonth: 48, label: '4 tahun',
        activities: {
          kasar: [
            'Bermain lempar bola lunak ke sasaran. Geser sasaran sedikit lebih jauh jika anak sudah nyaman.',
            'Buat beberapa tanda di lantai dan ajak anak melompat dari satu tanda ke tanda lain sesuai kemampuannya.'
          ],
          halus: [
            'Ajak anak menggambar seseorang yang ia kenal dan tambahkan detail yang ia pilih sendiri.',
            'Gunakan balok untuk meniru pola sederhana yang Anda buat, lalu minta anak membuat pola versinya sendiri.'
          ],
          bahasa: [
            'Bermain pura-pura menjadi penjual dan pembeli. Bergantian bertanya apa yang ingin dibeli dan menjawab.',
            'Setelah membaca cerita, ajak anak menceritakan kejadian favoritnya dengan kata-katanya sendiri.'
          ],
          sosial: [
            'Mainkan permainan bergiliran dengan satu aturan yang disepakati sebelum mulai.',
            'Ajak anak menyikat gigi sendiri, sambil mendampingi dan membantu membersihkan bagian yang terlewat.'
          ]
        }
      },
      {
        fromMonth: 60, label: '5–6 tahun',
        activities: {
          kasar: [
            'Buat lintasan sederhana di lantai dengan tanda untuk berlari pelan, berhenti, dan melompat.',
            'Bermain tangkap bola lunak. Ubah jarak secara bertahap mengikuti kemampuan anak.'
          ],
          halus: [
            'Ajak anak menggunting bentuk besar dengan gunting khusus anak sambil didampingi, lalu menempelkannya menjadi gambar.',
            'Ajak anak menulis namanya pada gambar yang ia buat. Beri contoh jika ia memerlukannya.'
          ],
          bahasa: [
            'Baca cerita bersama, lalu minta anak menjelaskan urutan kejadian dari awal hingga akhir.',
            'Ajak anak menjelaskan benda yang ia pilih, misalnya untuk apa benda itu dan bagaimana cara menggunakannya.'
          ],
          sosial: [
            'Bagi tugas saat membereskan mainan. Biarkan anak memilih satu tugas dan menyelesaikannya.',
            'Bermain toko-tokoan dengan anggota keluarga. Ajak anak menyepakati peran dan bergiliran saat bermain.'
          ]
        }
      }
    ];

    const NUTRITION_LINKS = {
      kia: 'https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf',
      mpasi: 'https://ayosehat.kemkes.go.id/pub/files/fb2ced153d97b36d44188f9cc9bea18d.pdf'
    };

    const MPASI_MILK_NOTE = 'Lanjutkan ASI sesuai kebutuhan sampai usia 2 tahun atau lebih. Tabel ini mengikuti acuan untuk anak yang mendapat ASI. Jika anak tidak mendapat ASI, bahas kebutuhan susu dan jadwal makan dengan petugas kesehatan.';

    const NUTRITION_GUIDES = [
      {
        fromMonth: 0,
        label: 'Di bawah 6 bulan',
        title: 'ASI eksklusif',
        frequency: 'Sesuai tanda lapar, siang dan malam',
        portionLabel: 'Kecukupan',
        portion: 'Ikuti kebutuhan bayi saat menyusu',
        texture: 'ASI saja, termasuk saat cuaca panas. MPASI dan air putih mulai diperkenalkan pada usia 6 bulan.',
        note: 'Jika bayi tidak mendapat ASI atau menyusu terasa sulit, minta bantuan petugas kesehatan untuk memilih pemberian susu yang sesuai.',
        source: 'kia',
        guidance: [
          ['Kenali tanda ingin menyusu', 'Tawarkan ASI ketika bayi mulai mencari puting atau membawa tangan ke mulut. Tangisan biasanya muncul lebih akhir.'],
          ['Amati proses menyusu', 'Perhatikan apakah bayi dapat melekat dan menelan. Bila pelekatan sulit, menyusui terasa nyeri terus-menerus, atau berat badan sulit naik, minta petugas mengamati langsung.'],
          ['Pantau pertumbuhan', 'Bawa Buku KIA saat penimbangan. Diskusikan pola menyusu dan kenaikan berat badan dengan petugas, terutama bila bayi tampak kurang menyusu.'],
          ['Siapkan awal MPASI', 'Menjelang 6 bulan, siapkan sendok, mangkuk bersih, dan bahan pangan keluarga yang mudah dimasak menjadi bubur kental.']
        ],
        menus: []
      },
      {
        fromMonth: 6,
        label: 'Usia 6–8 bulan',
        title: 'Mulai MPASI lumat dan kental',
        frequency: '2–3 kali makan utama\n1–2 kali selingan',
        portion: 'Mulai 2–3 sdm; naik bertahap ke ½ mangkuk ukuran 250 ml',
        texture: 'Lumatkan makanan matang sampai lembut. Pertahankan konsistensi kental, bukan sekadar air kaldu.',
        source: 'mpasi',
        guidance: [
          ['Mulai dari porsi kecil', 'Tawarkan beberapa sendok saat bayi terjaga dan siap makan. Tambah jumlah secara bertahap sambil memperhatikan tanda lapar dan kenyang.'],
          ['Susun makanan utama beragam', 'Contohnya beras sebagai makanan pokok, ikan atau telur sebagai lauk hewani, wortel atau labu, dan sedikit minyak saat memasak. Selang-seling bahan yang tersedia.'],
          ['Atur waktu makan dan menyusu', 'Sebagai awal, tawarkan makan utama pagi dan siang, lalu tambah kesempatan makan sore sesuai kesiapan. Tempatkan selingan di antara makan utama dan lanjutkan menyusu.']
        ],
        menus: [
          { name: 'Bubur nasi ayam labu', ingredients: 'Beras, ayam tanpa tulang, labu kuning, dan sedikit minyak.', method: 'Masak beras, ayam, dan labu hingga lunak serta matang. Haluskan bersama sampai menjadi bubur kental.' },
          { name: 'Bubur kentang ikan kembung', ingredients: 'Kentang, ikan kembung tanpa duri, bayam, dan sedikit minyak.', method: 'Kukus kentang dan ikan sampai matang. Periksa kembali durinya, lalu lumatkan bersama bayam matang.' },
          { name: 'Bubur nasi telur tempe', ingredients: 'Nasi, telur, tempe, wortel, dan sedikit minyak.', method: 'Masak telur hingga matang dan lunakkan tempe serta wortel. Masak bersama nasi hingga lunak, lalu lumatkan sampai kental.' },
          { name: 'Pepaya lumat', snack: true, ingredients: 'Pepaya matang tanpa biji.', method: 'Cuci dan kupas buah. Lumatkan daging buah sampai halus dan sajikan.' },
          { name: 'Alpukat lumat', snack: true, ingredients: 'Alpukat matang.', method: 'Ambil daging buah dan lumatkan hingga lembut. Sajikan tanpa tambahan gula atau madu.' }
        ]
      },
      {
        fromMonth: 9,
        label: 'Usia 9–11 bulan',
        title: 'MPASI cincang dan makanan pegangan',
        frequency: '3–4 kali makan utama\n1–2 kali selingan',
        portion: '½–¾ mangkuk ukuran 250 ml',
        texture: 'Mulai dari cincang halus, lalu naikkan tekstur bertahap. Makanan pegangan harus cukup lunak untuk diremas dengan jari.',
        source: 'mpasi',
        guidance: [
          ['Latih mengunyah bertahap', 'Tambahkan sedikit tekstur pada makanan yang sudah dikenali anak. Beri waktu untuk mencoba dan sesuaikan ukuran serta kelembutan potongan.'],
          ['Putar bahan makanan', 'Ganti lauk antarwaktu makan, misalnya ayam dengan ikan, daging, atau telur. Lengkapi dengan makanan pokok, sayur atau buah, dan sumber lemak.'],
          ['Atur waktu bersama keluarga', 'Contohnya makan pagi, siang, dan sore atau malam. Beri selingan di antara waktu itu. Tambahkan kesempatan makan sesuai panduan frekuensi dan kebutuhan anak.']
        ],
        menus: [
          { name: 'Nasi tim ikan kembung dan wortel', ingredients: 'Nasi, ikan kembung tanpa duri, wortel, dan sedikit minyak.', method: 'Masak nasi dan wortel sampai lunak. Campurkan ikan matang yang telah diperiksa durinya, lalu cincang halus sesuai kemampuan bayi.' },
          { name: 'Tim ayam tahu bayam', ingredients: 'Beras, ayam cincang, tahu, bayam, dan sedikit minyak.', method: 'Masak beras bersama ayam dan tahu sampai matang dan lunak. Masukkan bayam, masak hingga layu, lalu sesuaikan tekstur dengan garpu.' },
          { name: 'Kentang kukus telur brokoli', ingredients: 'Kentang, telur, brokoli, dan sedikit minyak.', method: 'Kukus kentang dan brokoli hingga mudah dilumatkan. Campur dengan telur matang yang dicincang halus.' },
          { name: 'Ubi kukus empuk', snack: true, ingredients: 'Ubi jalar.', method: 'Kupas dan kukus ubi sampai dapat diremas. Lumatkan atau sajikan dalam potongan lunak yang sesuai kemampuan anak, sambil didampingi.' },
          { name: 'Yogurt tawar dan pisang lumat', snack: true, ingredients: 'Yogurt pasteurisasi tanpa gula dan pisang matang.', method: 'Lumatkan pisang dengan garpu, campur dengan yogurt, lalu sajikan dalam mangkuk kecil.' }
        ]
      },
      {
        fromMonth: 12,
        label: 'Usia 12–23 bulan',
        title: 'Transisi ke makanan keluarga',
        frequency: '3–4 kali makan utama\n1–2 kali selingan',
        portion: '¾–1 mangkuk ukuran 250 ml',
        texture: 'Sajikan makanan keluarga yang empuk. Iris atau suwir sesuai kemampuan mengunyah, lalu pastikan bebas tulang dan duri.',
        source: 'mpasi',
        guidance: [
          ['Ambil porsi anak sebelum membumbui', 'Saat memasak untuk keluarga, pisahkan porsi anak sebelum menambah banyak garam, gula, atau saus. Potong lauk dan sayuran supaya mudah dikunyah.'],
          ['Latih makan mandiri', 'Berikan sendok pendek atau cangkir kecil yang mudah dipegang. Dampingi dan bantu bila anak memerlukan, tanpa memaksa menghabiskan porsi.'],
          ['Bangun jadwal yang mudah diikuti', 'Tetapkan waktu makan utama dan selingan sesuai rutinitas keluarga. Beri air putih dan lanjutkan ASI sesuai kebutuhan.']
        ],
        menus: [
          { name: 'Nasi sup ayam kentang bayam', ingredients: 'Nasi, ayam, kentang, bayam, dan sedikit minyak.', method: 'Rebus ayam dan kentang hingga matang dan empuk. Tambahkan bayam, suwir ayam, lalu sajikan sup beserta isi dan nasi.' },
          { name: 'Nasi ikan kuah kuning dan labu', ingredients: 'Nasi, ikan tanpa duri, labu, kunyit, dan sedikit minyak.', method: 'Masak labu dan ikan dengan kuah kunyit yang ringan. Pisahkan duri, suwir ikan, lalu hidangkan bersama nasi.' },
          { name: 'Nasi telur orak-arik tahu dan buncis', ingredients: 'Nasi, telur, tahu, buncis, dan sedikit minyak.', method: 'Masak buncis hingga empuk. Orak-arik telur dan tahu sampai matang, campur dengan buncis cincang, lalu sajikan bersama nasi.' },
          { name: 'Bubur oat apel', snack: true, ingredients: 'Oat polos, apel, dan air.', method: 'Kupas, buang biji, dan potong apel. Masak apel dan oat sampai lunak, lalu lumatkan bila diperlukan.' },
          { name: 'Pisang dan yogurt tawar', snack: true, ingredients: 'Pisang matang dan yogurt pasteurisasi tanpa gula.', method: 'Potong pisang secara memanjang lalu menjadi bagian kecil yang lunak. Sajikan bersama yogurt tawar.' }
        ]
      },
      {
        fromMonth: 24,
        label: 'Usia 2 tahun ke atas',
        title: 'Gizi seimbang dengan menu keluarga',
        frequency: '3 kali makan utama; selingan bergizi di antaranya',
        portion: 'Mulai dari porsi anak, lalu tambah bila masih lapar',
        texture: 'Lengkapi makanan pokok dengan lauk, sayur, dan buah. Pilih tekstur serta ukuran potong sesuai kemampuan anak.',
        note: 'Utamakan air putih. Pilih buah utuh yang dipotong aman sebagai selingan dan batasi minuman manis serta camilan tinggi garam atau gula.',
        source: 'kia',
        guidance: [
          ['Variasikan isi piring', 'Ganti nasi sesekali dengan kentang, jagung, atau ubi. Pilih lauk seperti ikan, telur, ayam, tahu, atau tempe, serta sajikan sayur dan buah.'],
          ['Makan bersama dan beri contoh', 'Tetapkan waktu makan bersama. Sajikan dalam porsi kecil terlebih dahulu dan biarkan anak meminta tambahan jika masih lapar.'],
          ['Libatkan anak memilih makanan', 'Ajak anak memilih antara dua jenis sayur atau buah. Tawarkan kembali makanan baru pada kesempatan lain dengan suasana santai.']
        ],
        menus: [
          { name: 'Nasi ayam panggang, capcay, dan pepaya', ingredients: 'Nasi, ayam tanpa tulang, wortel, kembang kol, dan pepaya matang.', method: 'Panggang ayam hingga matang. Masak sayur sampai empuk lalu potong sesuai kemampuan anak. Hidangkan dengan nasi dan pepaya.' },
          { name: 'Kentang, ikan kukus, dan tumis bayam', ingredients: 'Kentang, ikan tanpa duri, bayam, dan sedikit minyak.', method: 'Rebus kentang dan kukus ikan sampai matang. Periksa duri, lalu sajikan bersama bayam yang dimasak hingga empuk.' },
          { name: 'Nasi, telur dadar sayur, dan tempe', ingredients: 'Nasi, telur, wortel, daun bawang, dan tempe.', method: 'Masak telur dengan sayuran cincang hingga matang. Kukus atau panggang tempe lalu potong bersama telur sesuai kemampuan anak.' },
          { name: 'Jagung lembut dan buah', snack: true, ingredients: 'Jagung manis dan buah matang, seperti pepaya.', method: 'Rebus jagung sampai lunak lalu tumbuk kasar. Sajikan bersama potongan pepaya yang aman untuk anak.' },
          { name: 'Yogurt tawar dengan buah', snack: true, ingredients: 'Yogurt pasteurisasi tanpa gula dan buah matang.', method: 'Cuci dan potong buah, lalu campurkan dengan yogurt. Sesuaikan ukuran potongan dengan kemampuan mengunyah.' }
        ]
      }
    ];

    const FOOD_SAFETY_GUIDANCE = [
      ['Makan responsif', 'Dampingi anak dalam posisi duduk. Beri makanan perlahan, tunggu sampai anak siap menerima suapan berikutnya, dan berhenti saat ia menunjukkan tanda kenyang.'],
      ['Kurangi risiko tersedak', 'Awasi setiap kali anak makan. Sesuaikan tekstur dan bentuk potongan. Hindari kacang utuh, anggur utuh, potongan wortel mentah yang keras, serta tulang dan duri.'],
      ['Jaga kebersihan', 'Cuci tangan dan alat makan, pisahkan bahan mentah dari makanan matang, dan masak telur, daging, serta ikan hingga matang.'],
      ['Perhatikan bahan dan minuman', 'Periksa bahan bila anak punya alergi. Utamakan air putih sebagai pendamping makan.'],
      ['Kapan meminta bantuan', 'Diskusikan dengan petugas Posyandu atau Puskesmas bila anak sering batuk saat makan, sulit mengunyah atau menelan, atau kenaikan berat badannya mengkhawatirkan.']
    ];

    // Routine reference for separate DPT-HB-Hib and IPV. KMK 1098/2024, attachment table 1.
    // Each record key represents a single dose. Regional eligibility is set by local policy.
    const VACCINE_GROUPS = [
      { label: 'Dalam 24 jam setelah lahir', doses: [
        { id: 'hb0', name: 'Hepatitis B dosis lahir (HB0)' },
      ] },
      { label: '1 bulan', doses: [
        { id: 'bcg', name: 'BCG' },
        { id: 'opv1', name: 'Polio tetes 1 (bOPV 1)' },
      ] },
      { label: '2 bulan', doses: [
        { id: 'dpt1', name: 'DPT-HB-Hib 1' },
        { id: 'opv2', name: 'Polio tetes 2 (bOPV 2)' },
        { id: 'pcv1', name: 'PCV 1' },
        { id: 'rv1', name: 'Rotavirus 1' },
      ] },
      { label: '3 bulan', doses: [
        { id: 'dpt2', name: 'DPT-HB-Hib 2' },
        { id: 'opv3', name: 'Polio tetes 3 (bOPV 3)' },
        { id: 'pcv2', name: 'PCV 2' },
        { id: 'rv2', name: 'Rotavirus 2' },
      ] },
      { label: '4 bulan', doses: [
        { id: 'dpt3', name: 'DPT-HB-Hib 3' },
        { id: 'opv4', name: 'Polio tetes 4 (bOPV 4)' },
        { id: 'ipv1', name: 'Polio suntik 1 (IPV 1)' },
        { id: 'rv3', name: 'Rotavirus 3' },
      ] },
      { label: '9 bulan', doses: [
        { id: 'mr1', name: 'Campak-Rubela 1' },
        { id: 'ipv2', name: 'Polio suntik 2 (IPV 2)' },
      ] },
      { label: '12 bulan', doses: [
        { id: 'pcv3', name: 'PCV 3' },
      ] },
      { label: '18 bulan', doses: [
        { id: 'dpt4', name: 'DPT-HB-Hib 4' },
        { id: 'mr2', name: 'Campak-Rubela 2' },
      ] },
    ];
    const JE_DOSE = { id: 'je', name: 'Japanese Encephalitis (JE)' };

    const STORY_TOPICS = {
      berat: { heading: 'Hari ini terasa berat', q1: 'Bagian mana dari hari ini yang paling berat bagimu?', q2: 'Siapa yang bisa kamu mintai bantuan untuk hal kecil besok?' },
      capek: { heading: 'Aku capek', q1: 'Hal apa yang paling menguras tenagamu hari ini?', q2: 'Jeda singkat apa yang bisa kamu ambil malam ini?' },
      bantuan: { heading: 'Aku butuh bantuan', q1: 'Bantuan praktis apa yang paling kamu perlukan saat ini?', q2: 'Pertanyaan apa yang ingin kamu bawa ke petugas atau keluarga?' }
    };

    let currentProfile = null;
    let routineItems = [];
    let vaccineRecords = Object.create(null);

    // State untuk Lembar Denver II Fotorealistik
    let observations = {};
    let obsSaved = false;
    let imgNaturalW = 0;
    let imgNaturalH = 0;
    let fitScale = 0.35;
    let scale = 0.35;
    let panX = 0;
    let panY = 0;
    let sheetFrame = 0;

    // The Android integration can pass the fractional calendar age to this same projection.
    function projectAgeOnSheet(ageInMonths) {
      const ticks = DENVER_SHEET_CALIBRATION.ticks;
      if (!Number.isFinite(ageInMonths) || ageInMonths < ticks[0][0] || ageInMonths > ticks.at(-1)[0]) return null;
      for (let i = 1; i < ticks.length; i++) {
        const [rightAge, rightTop, rightBottom] = ticks[i];
        if (ageInMonths > rightAge) continue;
        const [leftAge, leftTop, leftBottom] = ticks[i - 1];
        const fraction = (ageInMonths - leftAge) / (rightAge - leftAge);
        const xTop = leftTop + fraction * (rightTop - leftTop);
        const xBottom = leftBottom + fraction * (rightBottom - leftBottom);
        return { xTop, xBottom, xMid: (xTop + xBottom) / 2 };
      }
    }

    function miniRulerPercent(xMid) {
      const ticks = DENVER_SHEET_CALIBRATION.ticks;
      const [, firstTop, firstBottom] = ticks[0];
      const [, lastTop, lastBottom] = ticks.at(-1);
      const start = (firstTop + firstBottom) / 2;
      const end = (lastTop + lastBottom) / 2;
      return ((xMid - start) / (end - start)) * 100;
    }

    function renderMiniRulerTicks() {
      const labels = document.getElementById('sheetRulerLabels');
      const visibleTicks = [[0, '0'], [6, '6 bln'], [12, '12 bln'], [24, '24 bln'], [48, '4 th'], [72, '6 th']];
      labels.replaceChildren();
      for (const [months, label] of visibleTicks) {
        const tick = document.createElement('span');
        tick.className = 'absolute top-0 whitespace-nowrap';
        tick.style.left = `${miniRulerPercent(projectAgeOnSheet(months).xMid)}%`;
        tick.style.transform = months === 0 ? 'none' : months === 72 ? 'translateX(-100%)' : 'translateX(-50%)';
        tick.textContent = label;
        labels.appendChild(tick);
      }
    }

    function applySheetTransform() {
      const viewport = document.getElementById('sheetViewport');
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      if (!width || !height || !imgNaturalW || !imgNaturalH) return;

      if (scale <= fitScale) {
        panX = (width - imgNaturalW * scale) / 2;
        panY = (height - imgNaturalH * scale) / 2;
      } else {
        panX = constrainSheetPosition(panX, width, imgNaturalW * scale);
        panY = constrainSheetPosition(panY, height, imgNaturalH * scale);
      }
      viewport.classList.toggle('is-zoomed', scale > fitScale);
      if (sheetFrame) return;
      sheetFrame = requestAnimationFrame(() => {
        sheetFrame = 0;
        document.getElementById('sheetTransformLayer').style.transform =
          `translate(${panX}px, ${panY}px) scale(${scale})`;
        document.getElementById('ageLineBadgeTop').style.transform =
          `scale(${1 / scale}) translate(-50%, calc(-100% - 4px))`;
      });
    }

    function setSheetZoom(start, nextScale, from, to = from) {
      const limitedScale = Math.max(fitScale, Math.min(fitScale * 5, nextScale));
      const next = anchorSheetZoom(start, limitedScale, from, to);
      scale = next.scale;
      panX = next.x;
      panY = next.y;
      applySheetTransform();
    }

    function fitSheetToScreen() {
      const viewport = document.getElementById('sheetViewport');
      if (!viewport || !imgNaturalW || !imgNaturalH) return;
      const vw = viewport.clientWidth;
      const vh = viewport.clientHeight;
      if (vw === 0 || vh === 0) return;
      fitScale = Math.min(vw / imgNaturalW, vh / imgNaturalH);
      scale = fitScale;
      applySheetTransform();
    }

    function clearSheetHighlight() {
      document.getElementById('focusedItemOutline').setAttribute('visibility', 'hidden');
    }

    function renderFocusedItem(item) {
      clearSheetHighlight();
      if (!item) return;
      const rect = document.getElementById('focusedItemOutline');
      rect.setAttribute('x', item.left - 6);
      rect.setAttribute('y', item.top - 4);
      rect.setAttribute('width', item.right - item.left + 12);
      rect.setAttribute('height', item.bottom - item.top + 8);
      rect.setAttribute('visibility', 'visible');
    }

    function focusOnSheetPoint({ yPct = 42, item = null } = {}) {
      const age = calculateAge(currentProfile);
      const projection = age ? projectAgeOnSheet(age.chartAge) : null;
      if (!projection || !imgNaturalW || !imgNaturalH) return;
      const viewport = document.getElementById('sheetViewport');
      const vw = viewport.clientWidth;
      const vh = viewport.clientHeight;
      if (vw === 0 || vh === 0) return;

      const x = item ? (item.left + item.right) / 2 : projection.xMid;
      const y = item ? (item.top + item.bottom) / 2 : (yPct / 100) * imgNaturalH;
      const preferredScale = item
        ? Math.min(fitScale * 5, (vw - 28) / (item.right - item.left))
        : Math.max(fitScale * 2.4, vw / (imgNaturalW * 0.42));
      scale = Math.max(fitScale, Math.min(fitScale * 5, preferredScale));
      panX = vw / 2 - x * scale;
      panY = vh / 2 - y * scale;
      renderFocusedItem(item);
      applySheetTransform();
    }

    function openItemOnSheet(item) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      focusOnSheetPoint({ item });
      document.getElementById('sheetViewport').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    let serviceTab = 'makan';

    function switchTab(tabId) {
      if (tabId === 'makan' || tabId === 'imunisasi') {
        serviceTab = tabId;
        tabId = 'layanan';
      }
      for (const button of document.querySelectorAll('[data-service-tab]')) {
        const selected = button.dataset.serviceTab === serviceTab;
        button.setAttribute('aria-pressed', String(selected));
        document.getElementById(button.getAttribute('aria-controls')).classList.toggle('hidden', !selected);
      }
      if (tabId === 'panduan') showGuideLibrary();
      ['beranda', 'pertumbuhan', 'perkembangan', 'layanan', 'panduan'].forEach(t => {
        const sec = document.getElementById(`tab-${t}`);
        if (sec) sec.classList.toggle('hidden', t !== tabId);
      });
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        const active = btn.getAttribute('data-tab') === tabId;
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (tabId === 'perkembangan' && !document.getElementById('viewChartArea').classList.contains('hidden')) {
        requestAnimationFrame(() => fitSheetToScreen());
      }
      window.scrollTo(0, 0);
    }

    function renderProfilePresentation() {
      const isDemo = currentProfile?.isDemo === true;
      document.getElementById('sheetModeLabel').textContent = isDemo ? 'Simulasi · 0–72 bln' : '0–72 bln';
      document.getElementById('mappingModeLabel').textContent = isDemo ? 'Profil demo' : 'Pemetaan sebagian';
      document.getElementById('obsStatusTag').textContent = isDemo ? 'Ringkasan observasi · simulasi' : 'Ringkasan observasi';
      document.getElementById('obsFormInstructions').textContent = isDemo
        ? 'Catat respons latihan untuk butir terpetakan yang dilintasi garis umur.'
        : 'Catat pengamatan untuk butir terpetakan yang dilintasi garis umur.';
    }

    function renderAll() {
      const age = calculateAge(currentProfile);
      const hasProfile = Boolean(currentProfile && age);
      renderProfilePresentation();

      document.getElementById('ageEmptyState').classList.toggle('hidden', hasProfile);
      document.getElementById('ageActiveState').classList.toggle('hidden', !hasProfile);

      if (hasProfile) {
        const labelName = currentProfile.name;
        document.getElementById('activeProfileSummary').textContent = `${labelName} · ${age.display}`;
        document.getElementById('activeProfileMeta').textContent = currentProfile.isDemo
          ? `Profil demo · Periksa ${formatDateId(currentProfile.examDate)}`
          : `Lahir ${formatDateId(currentProfile.birthDate)} · Periksa ${formatDateId(currentProfile.examDate)}`;
        document.getElementById('devAgeSummary').textContent = `${labelName} · ${age.display}${currentProfile.isDemo ? ' · Profil demo' : ''}`;
        document.getElementById('nutritionAgeHeader').textContent = `${labelName} · ${age.display}`;

      } else {
        document.getElementById('devAgeSummary').textContent = 'Belum ada profil usia';
        document.getElementById('nutritionAgeHeader').textContent = 'Belum ada profil usia';
      }

      document.getElementById('devEmptyNotice').classList.toggle('hidden', hasProfile);
      document.getElementById('devMainContent').classList.toggle('hidden', !hasProfile);
      document.getElementById('makanEmptyNotice').classList.toggle('hidden', hasProfile);
      document.getElementById('makanMainContent').classList.toggle('hidden', !hasProfile);

      if (hasProfile) {
        renderStimulationCards(age);
        renderDenverSheetView(age);
        renderNutrition(age);
      }
      renderRoutines();
      renderVaccines();
      updateVisitPrepSummary();
      renderVisitOverview();
    }

    function renderStimulationCards(age) {
      const group = age.chartAge <= 72
        ? STIMULATION_GROUPS.findLast(entry => age.fullMonths >= entry.fromMonth)
        : null;
      const label = document.getElementById('stimGroupLabel');
      const container = document.getElementById('stimulationCardsList');
      label.textContent = group ? `Stimulasi usia ${group.label}` : 'Peta stimulasi';
      document.getElementById('stimOutOfRange').classList.toggle('hidden', Boolean(group));
      document.getElementById('stimGuidance').classList.toggle('hidden', !group);
      document.getElementById('stimReferences').classList.toggle('hidden', !group);
      container.replaceChildren();
      if (!group) return;

      for (const [domain, name] of Object.entries(STIMULATION_DOMAINS)) {
        const card = document.createElement('article');
        card.className = 'rounded-lg border border-divider bg-surface px-4 py-3 space-y-2';
        const heading = document.createElement('h3');
        heading.className = 'text-sm font-semibold text-primary';
        heading.textContent = name;
        const list = document.createElement('ul');
        list.className = 'list-disc pl-4 space-y-1.5 text-sm leading-relaxed text-ink';
        for (const activity of group.activities[domain]) {
          const item = document.createElement('li');
          item.textContent = activity;
          list.append(item);
        }
        card.append(heading, list);
        container.append(card);
      }
    }

    function renderDenverSheetView(age) {
      if (!age) return;
      const prefix = currentProfile && currentProfile.isDemo ? 'Nara' : 'Usia anak';
      document.getElementById('sheetProfileLine').textContent = `${prefix} · ${age.display}`;

      const projection = projectAgeOnSheet(age.chartAge);
      const overlay = document.getElementById('ageLineOverlay');
      const stroke = document.getElementById('ageLineStroke');
      const badge = document.getElementById('ageLineBadgeTop');
      const fillEl = document.getElementById('sheetRulerFill');
      const needleEl = document.getElementById('sheetRulerNeedle');
      const showOverlay = Boolean(projection && imgNaturalW);
      overlay.classList.toggle('hidden', !showOverlay);
      badge.classList.toggle('hidden', !showOverlay);
      document.getElementById('outOfRangeBanner').classList.toggle('hidden', Boolean(projection));
      needleEl.classList.toggle('hidden', !projection);

      if (projection) {
        const { width, topY, bottomY } = DENVER_SHEET_CALIBRATION;
        stroke.setAttribute('x1', projection.xTop);
        stroke.setAttribute('y1', topY);
        stroke.setAttribute('x2', projection.xBottom);
        stroke.setAttribute('y2', bottomY);
        badge.style.left = `${(projection.xTop / width) * 100}%`;
        badge.textContent = age.display;

        const rulerPosition = miniRulerPercent(projection.xMid);
        fillEl.style.width = `${rulerPosition}%`;
        needleEl.style.left = `${rulerPosition}%`;
      } else {
        fillEl.style.width = '0%';
      }

      clearSheetHighlight();
      renderSectorLists(age);
      renderObservationSection();
    }

    function getCrossingItems(ageInMonths) {
      const projection = projectAgeOnSheet(ageInMonths);
      if (!projection) return [];
      const { topY, bottomY } = DENVER_SHEET_CALIBRATION;
      return MAPPED_SHEET_ITEMS.flatMap(item => {
        const middleY = (item.top + item.bottom) / 2;
        const proportion = (middleY - topY) / (bottomY - topY);
        const x = projection.xTop + proportion * (projection.xBottom - projection.xTop);
        const t = SCAN_EDGE_TOLERANCE_PX;
        if (x < item.left - t || x > item.right + t) return [];
        let region = x < item.green ? 'Bagian putih' : 'Bagian hijau';
        if (Math.abs(x - item.left) <= t || Math.abs(x - item.right) <= t) {
          region = 'Dekat tepi balok';
        } else if (Math.abs(x - item.green) <= t) {
          region = 'Dekat batas putih dan hijau';
        }
        return [{ ...item, x, region }];
      });
    }

    function renderSectorLists(age) {
      const stateMessage = document.getElementById('mappingUnavailableBox');
      const summaryBar = document.getElementById('sectorMatchSummaryBar');
      const container = document.getElementById('sectorListsContainer');
      const crossing = getCrossingItems(age.chartAge);
      const count = MAPPED_SHEET_ITEMS.length;
      document.getElementById('mappingCoverageNote').textContent =
        `Posisi garis dihitung pada ${count} balok yang sudah dipetakan. Daftar ini belum mencakup seluruh lembar.`;
      summaryBar.replaceChildren();
      container.replaceChildren();
      summaryBar.classList.toggle('hidden', crossing.length === 0);
      stateMessage.classList.toggle('hidden', crossing.length > 0);

      if (crossing.length === 0) {
        stateMessage.textContent = projectAgeOnSheet(age.chartAge)
          ? 'Belum ada kecocokan pada balok yang dipetakan. Balok lain pada lembar masih perlu dipetakan.'
          : 'Usia di luar rentang lembar. Daftar butir tidak tersedia.';
        return;
      }

      for (const sector of SECTORS) {
        const matches = crossing.filter(item => item.sectorId === sector.id);
        const pill = document.createElement('div');
        pill.className = 'bg-surface border border-divider rounded-lg p-2';
        pill.title = sector.label;
        pill.innerHTML = `<div class="font-mono text-[10px] font-semibold text-primary">${sector.code}</div>
          <div class="font-mono text-sm font-semibold text-ink">${matches.length}</div>`;
        summaryBar.appendChild(pill);

        const card = document.createElement('section');
        card.className = 'bg-surface border border-divider rounded-lg overflow-hidden';
        const header = document.createElement('h3');
        header.className = 'px-4 py-2.5 bg-paper border-b border-divider text-xs font-semibold text-ink';
        header.textContent = sector.label;
        card.appendChild(header);
        if (matches.length === 0) {
          const message = document.createElement('p');
          message.className = 'px-4 py-3 text-xs text-muted';
          message.textContent = 'Belum ada kecocokan pada balok yang dipetakan di sektor ini.';
          card.appendChild(message);
        }
        for (const item of matches) {
          const row = document.createElement('div');
          row.className = 'denver-item-row px-4 py-2 border-b border-divider last:border-b-0';
          const text = document.createElement('div');
          const name = document.createElement('p');
          name.className = 'text-sm font-medium text-ink';
          name.textContent = item.name;
          const region = document.createElement('p');
          region.className = 'text-xs text-muted';
          region.textContent = item.region;
          text.append(name, region);
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'min-h-11 px-2 text-xs font-semibold text-primary hover:bg-soft rounded-lg';
          button.textContent = 'Lihat pada lembar';
          button.setAttribute('aria-label', `Lihat ${item.name} pada lembar`);
          button.addEventListener('click', () => openItemOnSheet(item));
          row.append(text, button);
          card.appendChild(row);
        }
        container.appendChild(card);
      }
    }

    function renderObservationSection() {
      const emptyBox = document.getElementById('obsEmptyBox');
      const formBox = document.getElementById('obsFormBox');
      const sumBox = document.getElementById('obsSummaryBox');
      const tag = document.getElementById('obsStatusTag');
      const age = calculateAge(currentProfile);
      const available = age ? getCrossingItems(age.chartAge).length : 0;
      const startButton = document.getElementById('btnStartObservation');
      startButton.disabled = available === 0;
      startButton.classList.toggle('hidden', available === 0);
      if (available === 0) formBox.classList.add('hidden');
      emptyBox.querySelector('p').textContent = available
        ? 'Observasi belum diisi.'
        : 'Belum ada butir terpetakan yang bisa dicatat pada usia ini.';

      if (!obsSaved) {
        tag.classList.add('hidden');
        sumBox.classList.add('hidden');
        if (formBox.classList.contains('hidden')) emptyBox.classList.remove('hidden');
      } else {
        tag.classList.remove('hidden');
        emptyBox.classList.add('hidden');
        formBox.classList.add('hidden');
        sumBox.classList.remove('hidden');
        const vals = Object.values(observations);
        const total = Math.max(1, available);
        const cT = vals.filter(v => v === 'teramati').length;
        const cB = vals.filter(v => v === 'belum-teramati').length;
        const cM = vals.filter(v => v === 'menolak').length;
        const cN = vals.filter(v => v === 'tidak-ada-kesempatan').length;

        const bar = document.getElementById('obsVisualBar');
        bar.innerHTML = `
          <div class="bg-primary h-full" style="width: ${(cT / total) * 100}%"></div>
          <div class="bg-muted/60 h-full" style="width: ${(cB / total) * 100}%"></div>
          <div class="bg-danger/70 h-full" style="width: ${(cM / total) * 100}%"></div>
          <div class="bg-divider h-full" style="width: ${(cN / total) * 100}%"></div>
        `;
        document.getElementById('obsSummaryCounts').textContent =
          `Terisi: ${vals.length}/${available} · Belum diisi: ${available - vals.length} · Teramati: ${cT} · Belum teramati: ${cB} · Menolak: ${cM} · Tidak ada kesempatan: ${cN}`;
      }
    }

    function openObservationForm() {
      const age = calculateAge(currentProfile);
      const crossing = age ? getCrossingItems(age.chartAge) : [];
      const rows = document.getElementById('obsFormRows');
      document.getElementById('obsFormError').classList.add('hidden');
      rows.innerHTML = '';
      if (crossing.length === 0) {
        rows.innerHTML = '<p class="py-2 text-xs text-muted">Tidak ada butir terpetakan pada rentang usia ini untuk dicatat.</p>';
      } else {
        crossing.forEach(item => {
          const cur = observations[item.id] || 'belum-diisi';
          const row = document.createElement('div');
          row.className = 'py-2.5 flex items-center justify-between gap-2 text-xs';
          row.innerHTML = `
            <span class="font-medium text-ink">${item.name}</span>
            <select class="obs-select border border-divider rounded-lg px-2 py-1.5 bg-surface text-ink min-h-10" data-id="${item.id}">
              <option value="belum-diisi" ${cur === 'belum-diisi' ? 'selected' : ''}>Belum diisi</option>
              <option value="teramati" ${cur === 'teramati' ? 'selected' : ''}>Teramati</option>
              <option value="belum-teramati" ${cur === 'belum-teramati' ? 'selected' : ''}>Belum teramati</option>
              <option value="menolak" ${cur === 'menolak' ? 'selected' : ''}>Menolak</option>
              <option value="tidak-ada-kesempatan" ${cur === 'tidak-ada-kesempatan' ? 'selected' : ''}>Tidak ada kesempatan</option>
            </select>
          `;
          rows.appendChild(row);
        });
      }
      document.getElementById('obsEmptyBox').classList.add('hidden');
      document.getElementById('obsSummaryBox').classList.add('hidden');
      document.getElementById('obsFormBox').classList.remove('hidden');
    }

    function initSheetImageAndGestures() {
      const img = document.getElementById('denverSheetImg');
      const errBox = document.getElementById('sheetErrorState');
      const viewport = document.getElementById('sheetViewport');

      const onError = () => {
        imgNaturalW = 0;
        imgNaturalH = 0;
        document.getElementById('ageLineOverlay').classList.add('hidden');
        document.getElementById('ageLineBadgeTop').classList.add('hidden');
        errBox.classList.remove('hidden');
      };

      const onReady = () => {
        const { width, height } = DENVER_SHEET_CALIBRATION;
        if (img.naturalWidth !== width || img.naturalHeight !== height) {
          onError();
          return;
        }
        imgNaturalW = width;
        imgNaturalH = height;
        document.getElementById('sheetTransformLayer').style.width = `${width}px`;
        errBox.classList.add('hidden');
        fitSheetToScreen();
        const age = calculateAge(currentProfile);
        if (age) renderDenverSheetView(age);
      };

      img.addEventListener('load', onReady);
      img.addEventListener('error', onError);
      document.getElementById('btnReloadSheet').addEventListener('click', () => {
        img.removeAttribute('src');
        img.src = window.DENVER_SHEET_DATA_URI;
      });
      renderMiniRulerTicks();
      img.src = window.DENVER_SHEET_DATA_URI;

      const touches = new Map();
      let gesture = null;

      function pinchGeometry(first, second) {
        const bounds = viewport.getBoundingClientRect();
        return {
          center: {
            x: (first.clientX + second.clientX) / 2 - bounds.left,
            y: (first.clientY + second.clientY) / 2 - bounds.top
          },
          distance: Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY)
        };
      }

      function beginTouchGesture() {
        const [first, second] = touches.values();
        gesture = null;
        if (second) {
          const { center, distance } = pinchGeometry(first, second);
          if (distance > 0) gesture = { center, distance, start: { scale, x: panX, y: panY } };
        } else if (first && scale > fitScale) {
          gesture = { previous: first };
        }
      }

      viewport.addEventListener('touchstart', event => {
        for (const touch of event.changedTouches) touches.set(touch.identifier, touch);
        beginTouchGesture();
      }, { passive: true });

      viewport.addEventListener('touchmove', event => {
        for (const touch of event.changedTouches) {
          if (touches.has(touch.identifier)) touches.set(touch.identifier, touch);
        }
        if (!gesture || !event.cancelable || !imgNaturalW) return;
        event.preventDefault();

        const [first, second] = touches.values();
        if (second) {
          const { center, distance } = pinchGeometry(first, second);
          setSheetZoom(gesture.start, gesture.start.scale * distance / gesture.distance, gesture.center, center);
        } else if (first && gesture.previous) {
          panX += first.clientX - gesture.previous.clientX;
          panY += first.clientY - gesture.previous.clientY;
          gesture.previous = first;
          applySheetTransform();
        }
      }, { passive: false });

      function finishTouchGesture(event) {
        for (const touch of event.changedTouches) touches.delete(touch.identifier);
        beginTouchGesture();
      }
      viewport.addEventListener('touchend', finishTouchGesture, { passive: true });
      viewport.addEventListener('touchcancel', finishTouchGesture, { passive: true });

      let pointer = null;
      viewport.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch' || event.button !== 0 || scale <= fitScale) return;
        pointer = event;
        viewport.setPointerCapture(event.pointerId);
      });
      viewport.addEventListener('pointermove', event => {
        if (pointer?.pointerId !== event.pointerId) return;
        panX += event.clientX - pointer.clientX;
        panY += event.clientY - pointer.clientY;
        pointer = event;
        applySheetTransform();
      });
      viewport.addEventListener('lostpointercapture', () => { pointer = null; });
      new ResizeObserver(() => {
        touches.clear();
        gesture = null;
        fitSheetToScreen();
      }).observe(viewport);
    }

    function renderNutrition(age) {
      const guide = NUTRITION_GUIDES.findLast(entry => age.fullMonths >= entry.fromMonth);
      const hasFood = guide.menus.length > 0;
      const source = document.getElementById('nutritionPrimarySource');
      source.href = NUTRITION_LINKS[guide.source];
      source.textContent = guide.source === 'mpasi' ? 'Juknis MP-ASI Kemenkes' : 'Buku KIA 2024';

      document.getElementById('nutriGroupBadge').textContent = guide.label;
      document.getElementById('nutriSubtitle').textContent = guide.title;
      document.getElementById('nutriFreq').textContent = guide.frequency;
      document.getElementById('nutriPortionLabel').textContent = guide.portionLabel ?? 'Porsi per makan utama';
      document.getElementById('nutriPortion').textContent = guide.portion;
      document.getElementById('nutriTextureLabel').textContent = hasFood ? 'Tekstur dan variasi' : 'Pemberian minum';
      document.getElementById('nutriTexture').textContent = guide.texture;
      document.getElementById('nutritionMilkNote').textContent = guide.note ?? MPASI_MILK_NOTE;
      document.getElementById('nutritionGuideTitle').textContent = hasFood ? 'Panduan makan sesuai usia' : 'Panduan menyusui dan memantau';
      document.getElementById('nutritionMenuSection').classList.toggle('hidden', !hasFood);
      document.getElementById('nutritionSafetyDetails').classList.toggle('hidden', !hasFood);
      document.querySelectorAll('[data-nutrition-details]').forEach(details => { details.open = false; });

      const guidance = [...guide.guidance];
      if (guide.source === 'mpasi') {
        guidance.push(['Keragaman sepanjang hari', 'Juknis memakai patokan minimal 5 dari 8 kelompok pangan dalam 24 jam: ASI, makanan pokok, kacang atau biji, produk susu, daging atau ikan atau unggas, telur, sayur atau buah kaya vitamin A, serta sayur atau buah lainnya.']);
      }
      const safety = [...FOOD_SAFETY_GUIDANCE];
      if (age.fullMonths < 12) {
        safety.push(['Khusus sebelum 12 bulan', 'Hindari madu, termasuk yang dicampur ke makanan atau minuman.']);
      }
      for (const [containerId, topics] of [
        ['nutritionGuideSteps', guidance],
        ['nutritionSafetySteps', hasFood ? safety : []]
      ]) {
        const container = document.getElementById(containerId);
        container.replaceChildren(...topics.map(([title, body]) => {
          const topic = document.createElement('div');
          const heading = document.createElement('h3');
          heading.className = 'text-sm font-semibold text-ink';
          heading.textContent = title;
          const text = document.createElement('p');
          text.className = 'mt-0.5 text-sm leading-relaxed text-muted';
          text.textContent = body;
          topic.append(heading, text);
          return topic;
        }));
      }

      const menus = document.getElementById('nutritionMenuList');
      const template = document.getElementById('nutritionMenuTemplate');
      menus.replaceChildren(...guide.menus.map(menu => {
        const card = template.content.firstElementChild.cloneNode(true);
        card.querySelector('.menu-name').textContent = menu.name;
        card.querySelector('.menu-type').textContent = menu.snack ? '· Selingan' : '· Makan utama';
        card.querySelector('.menu-ingredients').textContent = menu.ingredients;
        card.querySelector('.menu-method').textContent = menu.method;
        const time = card.querySelector('input');
        time.value = menu.snack ? '15:00' : '12:00';
        time.setAttribute('aria-label', `Jam untuk ${menu.name}`);
        const feedback = card.querySelector('.menu-feedback');
        time.addEventListener('input', () => { feedback.textContent = ''; });
        card.querySelector('form').addEventListener('submit', event => {
          event.preventDefault();
          if (!time.value) return;
          const exists = routineItems.some(item => item.time === time.value && item.text === menu.name);
          if (exists) {
            feedback.textContent = `Menu ini sudah tercatat pada ${time.value}.`;
            return;
          }
          addRoutineItem(time.value, menu.name);
          feedback.textContent = `Ditambahkan ke rutinitas pukul ${time.value}.`;
        });
        return card;
      }));
    }

    function addRoutineItem(time, text) {
      routineItems.push({ time, text });
      saveVisitStore();
      renderRoutines();
    }

    function renderRoutines() {
      const list = document.getElementById('routineItemsList');
      list.replaceChildren();
      if (routineItems.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-xs text-muted py-2';
        empty.textContent = 'Belum ada aktivitas rutin yang ditambahkan.';
        list.append(empty);
        return;
      }

      const orderedItems = [...routineItems].sort((first, second) => first.time.localeCompare(second.time));
      for (const item of orderedItems) {
        const row = document.createElement('div');
        row.className = 'py-2.5 flex items-center justify-between gap-2 text-sm';
        const entry = document.createElement('div');
        entry.className = 'min-w-0 break-words';
        const time = document.createElement('time');
        time.className = 'font-mono text-xs font-semibold text-primary mr-2';
        time.dateTime = item.time;
        time.textContent = item.time;
        const activity = document.createElement('span');
        activity.className = 'text-ink';
        activity.textContent = item.text;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'min-h-10 px-2 text-xs text-danger font-semibold shrink-0';
        remove.textContent = 'Hapus';
        remove.setAttribute('aria-label', `Hapus ${item.text} pukul ${item.time}`);
        remove.addEventListener('click', () => {
          routineItems.splice(routineItems.indexOf(item), 1);
          saveVisitStore();
          renderRoutines();
        });
        entry.append(time, activity);
        row.append(entry, remove);
        list.append(row);
      }
    }

    function clearVaccineForm() {
      document.getElementById('selectVaccineId').value = '';
      document.getElementById('inputVaccineDate').value = '';
      const error = document.getElementById('vaccineFormError');
      error.textContent = '';
      error.classList.add('hidden');
    }

    function vaccineRecordProblem(doseId, date, profile) {
      if (!profile) return 'Isi profil usia untuk mencatat riwayat.';
      if (doseId !== JE_DOSE.id && !VACCINE_GROUPS.some(group => group.doses.some(dose => dose.id === doseId))) {
        return 'Pilih satu dosis yang tercatat.';
      }
      const given = parseDate(date);
      if (!given) return 'Masukkan tanggal pemberian yang sah.';
      if (diffDays(parseDate(profile.birthDate), given) < 0) return 'Tanggal pemberian tidak boleh sebelum tanggal lahir.';
      if (diffDays(given, parseDate(profile.examDate)) < 0) return 'Masukkan tanggal pemberian hingga tanggal pemeriksaan.';
      return '';
    }

    function vaccineRecordStatus(date, profile) {
      if (!date) return 'Belum tercatat';
      const status = `Tercatat · ${formatDateId(date)}`;
      return date > profile.examDate ? `${status} (setelah tanggal pemeriksaan)` : status;
    }

    function renderVaccines() {
      const list = document.getElementById('vaccineListContainer');
      const select = document.getElementById('selectVaccineId');
      const previous = select.value;
      list.replaceChildren();
      select.replaceChildren(new Option('Pilih satu dosis', ''));

      const hasProfile = Boolean(currentProfile);
      select.disabled = !hasProfile;
      document.getElementById('inputVaccineDate').disabled = !hasProfile;
      document.getElementById('btnSaveVaccineRecord').disabled = !hasProfile;
      const context = document.getElementById('vaccineRecordContext');
      context.textContent = !hasProfile
        ? 'Isi profil usia untuk mencatat riwayat.'
        : (currentProfile.isDemo ? 'Profil demo Nara.' : 'Profil pemeriksaan aktif.') + ' Pastikan profil aktif cocok dengan Buku KIA anak.';

      function appendDose(dose, host, optionGroup) {
        optionGroup.appendChild(new Option(dose.name, dose.id));
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between gap-3 border-t border-divider px-4 py-2';
        const text = document.createElement('div');
        const label = document.createElement('div');
        label.className = 'text-sm font-medium text-ink';
        label.textContent = dose.name;
        const status = document.createElement('div');
        status.className = 'mt-0.5 text-xs text-muted';
        const date = hasProfile ? vaccineRecords[dose.id] : null;
        status.textContent = hasProfile ? vaccineRecordStatus(date, currentProfile) : '';
        status.hidden = !hasProfile;
        text.append(label, status);
        row.append(text);
        if (date) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'min-h-10 px-2 text-xs font-semibold text-danger';
          button.textContent = 'Hapus';
          button.setAttribute('aria-label', `Hapus catatan ${dose.name}`);
          button.addEventListener('click', () => {
            delete vaccineRecords[dose.id];
              saveVisitStore();
            renderVaccines();
          });
          row.appendChild(button);
        }
        host.appendChild(row);
      }

      for (const group of VACCINE_GROUPS) {
        const optionGroup = document.createElement('optgroup');
        optionGroup.label = group.label;
        select.appendChild(optionGroup);
        const section = document.createElement('section');
        const heading = document.createElement('h2');
        heading.className = 'px-4 py-2 text-sm font-semibold text-primary bg-paper';
        heading.textContent = group.label;
        section.appendChild(heading);
        group.doses.forEach(dose => appendDose(dose, section, optionGroup));
        list.appendChild(section);
      }

      const regional = document.getElementById('regionalVaccineRecord');
      regional.replaceChildren();
      const optionGroup = document.createElement('optgroup');
      optionGroup.label = 'JE · program wilayah endemis';
      select.appendChild(optionGroup);
      if (hasProfile) appendDose(JE_DOSE, regional, optionGroup);
      select.value = hasProfile ? previous : '';
    }

    function updateVisitPrepSummary() {
      const checks = document.querySelectorAll('.visit-check');
      const total = checks.length;
      const done = Array.from(checks).filter(c => c.checked).length;
      document.getElementById('visitPrepSummary').textContent = done > 0
        ? `${done} dari ${total} persiapan dicentang`
        : 'Ceklis Buku KIA, riwayat dan tindak lanjut';
      const ring = document.getElementById('visitProgressRing');
      const txt = document.getElementById('visitProgressText');
      if (ring && txt) {
        const circumference = 56.5;
        ring.style.strokeDashoffset = String(circumference - (done / total) * circumference);
        txt.textContent = `${done}/${total}`;
      }
    }

    const visitPersistence = createVisitPersistence(createNativeRequest(window.BukuSakuNative));
    const GROWTH_MEASURES = {
      weight: ['visitWeight', 'BB', 'kg'],
      height: ['visitHeight', 'PB/TB', 'cm'],
      head: ['visitHead', 'Lingkar kepala', 'cm'],
      arm: ['visitArm', 'LiLA', 'cm']
    };
    let visitStore = { version: 1, selected: null, children: [], visits: [] };
    let storageReady = false;
    let pendingSaves = 0;
    let lastSave = Promise.resolve(true);
    let storageNoticeTimer;
    let activeVisit = null;
    let activeChild = null;
    let visitFormMode = 'child';
    let measurementStep = false;

    function visitElement(id) {
      return document.getElementById(id);
    }

    function storageNotice(message, retryLabel = '', retry = null) {
      window.clearTimeout(storageNoticeTimer);
      const notice = visitElement('visitStorageWarning');
      visitElement('storageMessage').textContent = message;
      const button = visitElement('storageRetry');
      button.classList.toggle('hidden', !retry);
      button.textContent = retryLabel;
      button.onclick = retry;
      notice.classList.toggle('hidden', !message);
    }

    async function loadVisitStore() {
      visitElement('mainContentArea').inert = true;
      document.querySelector('.app-nav').inert = true;
      storageNotice('Membuka data di perangkat…');
      try {
        visitStore = await visitPersistence.load();
        storageReady = true;
        activateVisit(visitStore.visits.find(visit => visit.id === visitStore.selected) ?? null, false);
        visitElement('mainContentArea').inert = false;
        document.querySelector('.app-nav').inert = false;
        storageNotice('');
      } catch (error) {
        storageNotice(error.message, 'Coba lagi', loadVisitStore);
      }
    }

    function saveVisitStore() {
      if (!storageReady) return Promise.resolve(false);
      pendingSaves++;
      storageNotice('Menyimpan perubahan…');
      lastSave = visitPersistence.save(visitStore).then(
        () => {
          if (--pendingSaves === 0) {
            storageNotice('Tersimpan di perangkat ini.');
            storageNoticeTimer = window.setTimeout(() => storageNotice(''), 1600);
          }
          return true;
        },
        error => {
          if (--pendingSaves === 0) {
            storageNotice('Perubahan belum tersimpan. ' + error.message, 'Simpan ulang', saveVisitStore);
          }
          return false;
        }
      );
      return lastSave;
    }

    async function importVisitHistory() {
      if (!storageReady || !await lastSave) return;
      const button = visitElement('btnImportVisits');
      button.disabled = true;
      try {
        const imported = await visitPersistence.importLegacy();
        if (!imported) return;
        visitStore = imported.data;
        activateVisit(visitStore.visits.find(visit => visit.id === visitStore.selected) ?? null, false);
        visitElement('modalAbout').close();
        storageNotice(imported.addedVisits
          ? imported.addedVisits + ' kunjungan diimpor.'
          : 'Impor selesai. Tidak ada kunjungan baru.', 'Tutup', () => storageNotice(''));
      } catch (error) {
        storageNotice(error.message, 'Tutup', () => storageNotice(''));
      } finally {
        button.disabled = false;
      }
    }

    function localVisitDate() {
      const now = new Date();
      return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
        .map(n => String(n).padStart(2, '0')).join('-');
    }

    function newVisitId() {
      return 'visit-' + Array.from(crypto.getRandomValues(new Uint32Array(4)), value => value.toString(16).padStart(8, '0')).join('');
    }

    function setVisitProfile(visit) {
      activeVisit = visit;
      activeChild = visitStore.children.find(child => child.id === visit?.childId) ?? null;
      if (!activeChild) activeVisit = null;
      visitStore.selected = activeVisit?.id ?? null;
      currentProfile = activeVisit ? { ...activeChild, examDate: activeVisit.examDate } : null;
    }

    function visitFormat(value, decimals = 2) {
      return new Intl.NumberFormat('id-ID', { maximumFractionDigits: decimals }).format(value);
    }

    function showVisitStep(showMeasurements) {
      measurementStep = showMeasurements;
      visitElement('visitProfileFields').classList.toggle('hidden', showMeasurements);
      visitElement('visitMeasureFields').classList.toggle('hidden', !showMeasurements);
      visitElement('btnVisitProfileBack').classList.toggle('hidden', !showMeasurements);
      visitElement('btnApplyDemoNaraModal').classList.toggle('hidden', showMeasurements);
      visitElement('visitFormStepLabel').textContent = showMeasurements ? '2 dari 2 · Pengukuran' : '1 dari 2 · Profil anak';
      visitElement('btnSaveAge').textContent = showMeasurements ? 'Simpan pemeriksaan' : 'Lanjut ke pengukuran';
      visitElement('errorVisitMeasure').classList.add('hidden');
      visitElement('ageForm').scrollTop = 0;
      if (visitElement('modalAgeInput').open) visitElement('ageModalTitle').focus({ preventScroll: true });
    }

    function openAgeModal(mode = activeVisit ? 'edit' : 'child') {
      visitFormMode = mode;
      const child = mode === 'child' ? null : activeChild;
      const visit = mode === 'edit' ? activeVisit : null;
      visitElement('ageForm').reset();
      document.getElementById('ageModalTitle').textContent = {
        edit: 'Ubah pemeriksaan', next: 'Kunjungan baru', child: 'Mulai pemeriksaan'
      }[mode];
      for (const [field, value] of [
        ['visitChildLabel', child?.name], ['visitSex', child?.sex],
        ['inputBirthDate', child?.birthDate], ['inputExamDate', visit?.examDate ?? localVisitDate()],
        ['visitPosition', visit?.measures.position]
      ]) visitElement(field).value = value ?? '';
      for (const [key, [id]] of Object.entries(GROWTH_MEASURES)) {
        visitElement(id).value = visit?.measures[key] ?? '';
      }
      visitElement('visitOedema').checked = visit?.measures.oedema === true;
      clearAgeErrors();
      visitElement('errorVisitSex').classList.add('hidden');
      showVisitStep(false);
      openAppDialog(visitElement('modalAgeInput'));
    }

    function visitProfileInput() {
      const birthDate = visitElement('inputBirthDate').value;
      const examDate = visitElement('inputExamDate').value;
      const birth = parseDate(birthDate);
      const exam = parseDate(examDate);
      const sex = visitElement('visitSex').value;
      clearAgeErrors();
      visitElement('errorVisitSex').classList.add('hidden');
      if (!birth) showFieldError('inputBirthDate', 'errorBirthDate', 'Masukkan tanggal lahir yang sah.');
      if (!exam) showFieldError('inputExamDate', 'errorExamDate', 'Masukkan tanggal pemeriksaan yang sah.');
      if (birth && exam && diffDays(birth, exam) < 0) {
        showFieldError('inputExamDate', 'errorExamDate', 'Tanggal pemeriksaan tidak boleh sebelum tanggal lahir.');
        return null;
      }
      if (!birth || !exam) return null;
      if (!['m', 'f'].includes(sex)) {
        const error = visitElement('errorVisitSex');
        error.textContent = 'Pilih jenis kelamin untuk kurva rujukan.';
        error.classList.remove('hidden');
        return null;
      }
      if (visitFormMode !== 'child' && visitStore.visits.some(visit =>
        visit.childId === activeChild.id && visit.id !== activeVisit.id && visit.examDate < birthDate
      )) {
        showFieldError('inputBirthDate', 'errorBirthDate', 'Tanggal lahir melewati tanggal pada salah satu kunjungan tersimpan.');
        return null;
      }
      return { name: visitElement('visitChildLabel').value.trim(), birthDate, examDate, sex };
    }

    function visitMeasurements() {
      const measures = {};
      const error = visitElement('errorVisitMeasure');
      function invalid(id, message) {
        error.textContent = message;
        error.classList.remove('hidden');
        visitElement(id).focus();
      }
      for (const [key, [id, label, unit]] of Object.entries(GROWTH_MEASURES)) {
        const input = visitElement(id).value.trim();
        const numeric = Number(input.replace(',', '.'));
        if (input && (!/^\d+(?:[.,]\d{1,2})?$/.test(input) || !Number.isFinite(numeric) || numeric <= 0)) {
          invalid(id, 'Isi ' + label + ' dalam ' + unit + ' dengan angka positif atau kosongkan.');
          return null;
        }
        measures[key] = input ? numeric : null;
      }
      measures.position = measures.height === null ? '' : visitElement('visitPosition').value;
      if (measures.height !== null && !['length', 'height'].includes(measures.position)) {
        invalid('visitPosition', 'Pilih posisi saat mengukur PB/TB.');
        return null;
      }
      measures.oedema = visitElement('visitOedema').checked;
      return measures;
    }

    function growthValueText(info) {
      return info.value === null ? '—' : visitFormat(info.value) + ' ' + info.unit;
    }

    function growthScoreText(z) {
      const display = Math.abs(z) < 0.005 ? 0 : z;
      return (display > 0 ? '+' : '') + new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
      }).format(display) + ' SD';
    }

    function growthVisitRow(visit, child, includeCode) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'home-shortcut justify-between';
      const text = document.createElement('span');
      const title = document.createElement('span');
      title.className = 'shortcut-title';
      title.textContent = includeCode ? child.name + ' · ' + formatDateId(visit.examDate) : formatDateId(visit.examDate);
      const summary = document.createElement('span');
      summary.className = 'shortcut-description';
      const measurements = Object.entries(GROWTH_MEASURES).flatMap(([key, [, label, unit]]) =>
        visit.measures[key] === null ? [] : [label + ' ' + visitFormat(visit.measures[key]) + ' ' + unit]);
      summary.textContent = measurements.join(' · ') || 'Pengukuran belum diisi';
      text.append(title, summary);
      const state = document.createElement('span');
      state.className = 'text-xs font-semibold text-primary shrink-0';
      state.textContent = visit.id === activeVisit?.id ? 'Aktif' : 'Buka';
      row.append(text, state);
      row.disabled = visit.id === activeVisit?.id;
      row.addEventListener('click', () => activateVisit(visit));
      return row;
    }

    function renderVisitOverview() {
      const list = visitElement('homeVisitList');
      list.replaceChildren(...[...visitStore.visits]
        .sort((a, b) => b.examDate.localeCompare(a.examDate))
        .flatMap(visit => {
          const child = visitStore.children.find(entry => entry.id === visit.childId);
          return child ? [growthVisitRow(visit, child, true)] : [];
        }));
      visitElement('homeVisitHistory').classList.toggle('hidden', !list.children.length);
      visitElement('growthEmpty').classList.toggle('hidden', Boolean(activeVisit));
      visitElement('growthContent').classList.toggle('hidden', !activeVisit);
      visitElement('growthProfileLabel').textContent = activeVisit
        ? currentProfile.name + ' · ' + calculateAge(currentProfile).display + ' · ' + (activeChild.sex === 'f' ? 'Perempuan' : 'Laki-laki')
        : 'Belum ada kunjungan';

      visitElement('btnOpenReferralRecords').classList.toggle('hidden', !isChildVisit(activeVisit, activeChild));
      updateGuideReferralButton();
      const summary = visitElement('homeMeasureSummary');
      summary.replaceChildren();
      if (!activeVisit) return;
      for (const [key, [, label, unit]] of Object.entries(GROWTH_MEASURES)) {
        const entry = document.createElement('span');
        entry.className = 'visit-measure-chip';
        const measurement = activeVisit.measures[key];
        entry.textContent = label + ' · ' + (measurement === null ? '—' : visitFormat(measurement) + ' ' + unit);
        summary.append(entry);
      }
      renderGrowth();
    }

    function renderGrowth() {
      if (!activeVisit) return;
      const growth = calculateGrowth(activeChild, activeVisit);
      const summary = visitElement('growthScores');
      summary.replaceChildren(...Object.entries(growth.indexes).map(([key, info]) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'growth-score text-left min-w-0 border border-divider rounded-md bg-surface p-3';
        const label = document.createElement('span');
        label.className = 'block text-xs font-semibold text-primary';
        label.textContent = info.label;
        const value = document.createElement('span');
        value.className = 'mt-1 block text-base font-semibold text-ink';
        value.textContent = growthValueText(info);
        const result = document.createElement('span');
        result.className = 'mt-1 block text-xs text-muted';
        result.textContent = (info.z === undefined ? '' : growthScoreText(info.z) + ' · ') + info.status;
        card.append(label, value, result);
        card.dataset.growthIndex = key;
        card.addEventListener('click', () => {
          visitElement('growthIndicator').value = key;
          renderGrowthChart(growth);
        });
        return card;
      }));
      const note = visitElement('growthMeasurementNote');
      const adjusted = activeVisit.measures.height !== null && growth.usedPosition !== activeVisit.measures.position;
      note.textContent = adjusted ? 'Ukuran asli ' + visitFormat(activeVisit.measures.height) + ' cm. Acuan ' +
        (growth.usedPosition === 'length' ? 'PB' : 'TB') + ' menggunakan ' + visitFormat(growth.corrected) + ' cm setelah koreksi 0,7 cm.' : '';
      note.classList.toggle('hidden', !adjusted);
      const visits = visitStore.visits.filter(visit => visit.childId === activeChild.id).sort((a, b) => b.examDate.localeCompare(a.examDate));
      visitElement('growthHistory').replaceChildren(...visits.map(visit => growthVisitRow(visit, activeChild, false)));
      renderGrowthChart(growth);
    }

    function renderGrowthChart(growth = calculateGrowth(activeChild, activeVisit)) {
      const key = visitElement('growthIndicator').value;
      const info = growth.indexes[key];
      const host = visitElement('growthChart');
      const detail = visitElement('growthPointInfo');
      const legend = visitElement('growthLegend');
      host.replaceChildren();
      legend.replaceChildren();
      for (const button of visitElement('growthScores').querySelectorAll('button')) {
        button.setAttribute('aria-pressed', String(button.dataset.growthIndex === key));
      }
      const isArm = key === 'arm';
      const isProportion = key === 'proportion';
      const ageBeyondTable = !isArm && growth.age.fullMonths > 60;
      const history = visitStore.visits.filter(visit => visit.childId === activeChild.id)
        .sort((a, b) => a.examDate.localeCompare(b.examDate));
      const points = history.flatMap(visit => {
        const point = calculateGrowth(activeChild, visit).indexes[key];
        return point.ref === info.ref && (isArm ? point.value !== null : point.z !== undefined)
          ? [{ ...point, visit }] : [];
      });
      detail.textContent = ageBeyondTable ? 'Grafik acuan ini tersedia pada umur 0–60 bulan penuh.' :
        info.value === null ? (points.length ? 'Pilih titik riwayat untuk melihat rinciannya.' : 'Belum ada hasil ukur untuk indikator ini.') :
        formatDateId(activeVisit.examDate) + ' · ' + growthValueText(info) +
          (info.z === undefined ? '' : ' · ' + growthScoreText(info.z)) + ' · ' + info.status;
      updateGrowthGuide(key, info, activeVisit, growth.age);
      if (ageBeyondTable || (isArm && !points.length)) {
        if (!ageBeyondTable) detail.textContent = 'Belum ada pengukuran LiLA.';
        return;
      }
      const rows = isProportion ? info.rows.filter((_, index) => index % 10 === 0) : info.rows;
      if (!rows.length && !isArm) return;

      const levels = {
        wfa: [-3, -2, 0, 1], length: [-3, -2, 0, 3],
        proportion: [-3, -2, 0, 1, 2, 3], bmi: [-3, -2, 0, 1, 2, 3],
        hcfa: [-2, 0, 2], arm: []
      };
      // The coloured zones follow the same category limits as growthCategory.
      // The outer limits only end the shading and are not labelled as cutoffs.
      const zonesByIndicator = {
        wfa: [[-4, -3, 'outer'], [-3, -2, 'near'], [-2, 1, 'normal'], [1, 2, 'outer']],
        length: [[-4, -3, 'outer'], [-3, -2, 'near'], [-2, 3, 'normal'], [3, 4, 'outer']],
        proportion: [[-4, -3, 'outer'], [-3, -2, 'near'], [-2, 1, 'normal'], [1, 2, 'near'], [2, 4, 'outer']],
        bmi: [[-4, -3, 'outer'], [-3, -2, 'near'], [-2, 1, 'normal'], [1, 2, 'near'], [2, 4, 'outer']],
        hcfa: [[-3, -2, 'outer'], [-2, 2, 'normal'], [2, 3, 'outer']],
        arm: []
      };
      const zones = zonesByIndicator[key];
      const restricted = key === 'wfa' || isProportion || key === 'bmi';
      const boundaryLevels = new Set([...levels[key], ...zones.flatMap(([lower, upper]) => [lower, upper])]);
      const curves = new Map([...boundaryLevels].map(z => [z, rows.map(row => {
        const edge = Math.sign(z) * 3;
        const value = growthCurveValue(row, restricted && Math.abs(z) > 3 ? edge : z);
        return [row[0], restricted && Math.abs(z) > 3
          ? value + (Math.abs(z) - 3) * (value - growthCurveValue(row, Math.sign(z) * 2))
          : value];
      })]));
      const xs = isArm ? points.map(point => point.x) : rows.map(row => row[0]);
      const ys = [...points.map(p => p.value), ...[...curves.values()].flatMap(curve => curve.map(([, y]) => y))];
      const minX = Math.min(...xs);
      const maxX = Math.max(minX + 1, ...xs);
      const minY = Math.floor(Math.min(...ys));
      const maxY = Math.max(minY + 1, Math.ceil(Math.max(...ys)));
      const x = value => 44 + (value - minX) * 269 / (maxX - minX);
      const y = value => 174 - (value - minY) * 149 / (maxY - minY);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 350 219');
      svg.setAttribute('class', 'w-full growth-plot');
      svg.setAttribute('role', 'group');
      svg.setAttribute('aria-label', 'Grafik ' + info.label + ', ' + activeChild.name);
      function svgNode(tag, props, text) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [name, value] of Object.entries(props)) node.setAttribute(name, value);
        if (text !== undefined) node.textContent = text;
        svg.append(node);
        return node;
      }

      const plotPoints = coordinates => coordinates.map(([a, b]) => x(a) + ',' + y(b)).join(' ');
      for (const [lower, upper, tone] of zones) {
        const coordinates = [...curves.get(upper), ...[...curves.get(lower)].reverse()];
        svgNode('polygon', { points: plotPoints(coordinates), class: 'growth-band growth-band-' + tone, 'aria-hidden': 'true' });
      }
      for (const [tone, label] of [
        ['normal', 'Rentang acuan'], ['near', 'Zona antara'], ['outer', 'Zona luar']
      ]) {
        if (!zones.some(zone => zone[2] === tone)) continue;
        const entry = document.createElement('span');
        const swatch = document.createElement('i');
        swatch.className = 'growth-band-' + tone;
        swatch.setAttribute('aria-hidden', 'true');
        entry.append(swatch, label);
        legend.append(entry);
      }

      for (let index = 0; index <= 4; index++) {
        const val = minY + index * (maxY - minY) / 4;
        svgNode('line', { x1: 44, x2: 313, y1: y(val), y2: y(val), class: 'growth-grid' });
        svgNode('text', { x: 38, y: y(val) + 3, 'text-anchor': 'end' }, visitFormat(val, 1));
      }
      const axisValues = isArm && points.length === 1 ? [minX] : Array.from({ length: isArm ? 3 : 5 }, (_, i) =>
        minX + i * (maxX - minX) / (isArm ? 2 : 4));
      for (const val of axisValues) {
        const tick = isArm ? new Intl.DateTimeFormat('id-ID', {day:'numeric',month:'short',timeZone:'UTC'})
          .format(new Date(Math.round(val) * 86400000)) : visitFormat(val, 1);
        svgNode('text', { x: x(val), y: 190, 'text-anchor': 'middle' }, tick);
      }
      svgNode('text', { x: 10, y: 14 }, info.unit);
      svgNode('text', { x: 178, y: 210, 'text-anchor': 'middle' },
        isArm ? 'Tanggal pemeriksaan' : isProportion ? ((info.ref === 'wfl' ? 'Panjang' : 'Tinggi') + ' badan (cm)') : 'Umur (bulan penuh)');
      for (const z of levels[key]) {
        const curve = curves.get(z);
        svgNode('polyline', { points: plotPoints(curve), class: 'growth-curve' + (z === 0 ? ' growth-median' : '') });
        svgNode('text', { x: 319, y: y(curve.at(-1)[1]) + 3 }, z > 0 ? '+' + z : String(z));
      }
      if (points.length > 1 && !isProportion) {
        svgNode('polyline', { points: points.map(p => x(p.x) + ',' + y(p.value)).join(' '), class: 'growth-series' });
      }
      for (const point of points) {
        const label = formatDateId(point.visit.examDate) + ' · ' + growthValueText(point) +
          (point.z === undefined ? '' : ' · ' + growthScoreText(point.z)) + ' · ' + point.status;
        const dot = svgNode('circle', { cx: x(point.x), cy: y(point.value), r: point.visit.id === activeVisit.id ? 5 : 3.5,
          tabindex: 0, role: 'button', 'aria-label': label, class: 'growth-dot' });
        const showPoint = () => {
          detail.textContent = label;
          const age = calculateAge({ birthDate: activeChild.birthDate, examDate: point.visit.examDate });
          updateGrowthGuide(key, point, point.visit, age);
        };
        dot.addEventListener('focus', showPoint);
        dot.addEventListener('click', showPoint);
        dot.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showPoint(); }
        });
      }
      host.append(svg);
    }

    let restoreKpsp;
    let resetDenverForVisit;

    function activateVisit(visit, save = true) {
      const changed = activeVisit?.id !== visit?.id;
      const birthDate = visitStore.children.find(child => child.id === visit?.childId)?.birthDate;
      const datesChanged = currentProfile?.birthDate !== birthDate || currentProfile?.examDate !== visit?.examDate;
      setVisitProfile(visit);
      if (changed || datesChanged) resetDenverForVisit();
      if (changed) {
        restoreKpsp();
        clearVaccineForm();
        observations = {};
        obsSaved = false;
        document.getElementById('obsFormBox').classList.add('hidden');
      }
      vaccineRecords = activeChild ? (activeChild.vaccines ??= {}) : Object.create(null);
      routineItems = activeVisit ? (activeVisit.routines ??= []) : [];
      if (save) saveVisitStore();
      renderAll();
      window.scrollTo(0, 0);
    }

    function applyVisitDemo() {
      let child = visitStore.children.find(entry => entry.id === 'demo-nara');
      if (!child) {
        child = {
          id: 'demo-nara', name: DEMO_PROFILE.name, birthDate: DEMO_PROFILE.birthDate, sex: 'f', isDemo: true
        };
        visitStore.children.push(child);
      }
      let visit = visitStore.visits.find(entry => entry.id === 'demo-nara-first');
      if (!visit) {
        visit = {
          id: 'demo-nara-first', childId: child.id, examDate: DEMO_PROFILE.examDate,
          measures: { weight: 8.4, height: 70.5, position: 'length', head: 44.1, arm: 14.2, oedema: false }
        };
        visitStore.visits.push(visit);
      }
      visitElement('modalAgeInput').close();
      activateVisit(visit);
    }

    function saveVisitForm(event) {
      event.preventDefault();
      const profile = visitProfileInput();
      if (!profile) {
        showVisitStep(false);
        return;
      }
      if (!measurementStep) {
        const age = calculateAge(profile);
        visitElement('visitComputedAge').textContent = 'Usia saat periksa · ' + age.display;
        showVisitStep(true);
        return;
      }
      visitElement('errorVisitMeasure').classList.add('hidden');
      const measures = visitMeasurements();
      if (!measures) return;

      const { examDate, ...identity } = profile;
      const child = visitFormMode === 'child' ? { id: newVisitId(), isDemo: false } : activeChild;
      identity.name ||= child.name || 'Anak ' + (visitStore.children.filter(entry => !entry.isDemo).length + 1);
      Object.assign(child, identity);
      if (visitFormMode === 'child') visitStore.children.push(child);
      const visit = visitFormMode === 'edit' ? activeVisit : { id: newVisitId(), childId: child.id };
      Object.assign(visit, { examDate, measures });
      if (visitFormMode !== 'edit') visitStore.visits.push(visit);
      visitElement('modalAgeInput').close();
      activateVisit(visit);
      switchTab('pertumbuhan');
    }

    function clearAgeErrors() {
      const eB = document.getElementById('errorBirthDate');
      const eE = document.getElementById('errorExamDate');
      const iB = document.getElementById('inputBirthDate');
      const iE = document.getElementById('inputExamDate');
      eB.classList.add('hidden');
      eE.classList.add('hidden');
      eB.textContent = '';
      eE.textContent = '';
      iB.classList.remove('border-danger');
      iE.classList.remove('border-danger');
    }

    function showFieldError(inputId, errorId, msg) {
      const inp = document.getElementById(inputId);
      const err = document.getElementById(errorId);
      inp.classList.add('border-danger');
      err.textContent = msg;
      err.classList.remove('hidden');
    }

    function initKpsp() {
      const data = bukuSakuData.kpsp;
      const agePicker = document.getElementById('kpspAgePicker');
      const ageOptions = document.getElementById('kpspAgeOptions');
      const ageTitle = document.getElementById('kpspAgeTitle');
      const form = document.getElementById('kpspQuestionnaire');
      const questions = document.getElementById('kpspQuestions');
      const template = document.getElementById('kpspQuestionTemplate');
      const questionnaireTitle = document.getElementById('kpspQuestionnaireTitle');
      const progress = document.getElementById('kpspAnswerProgress');
      const result = document.getElementById('kpspResult');
      const resultTitle = document.getElementById('kpspResultTitle');
      const imageDialog = document.getElementById('kpspImageDialog');
      const enlargedImage = document.getElementById('kpspEnlargedImage');
      const drafts = new Map();
      let activeGroup = null;

      function showView(view, focusTarget) {
        [agePicker, form, result].forEach(panel => panel.classList.toggle('hidden', panel !== view));
        if (focusTarget) {
          focusTarget.focus({ preventScroll: true });
          view.scrollIntoView({ block: 'start' });
        }
      }

      function updateProgress() {
        const count = questions.querySelectorAll('input:checked').length;
        progress.textContent = `${count} dari ${activeGroup.questions.length} terjawab`;
      }

      function openQuestionnaire(group, focus = true) {
        activeGroup = group;
        questionnaireTitle.textContent = `KPSP ${group.age} bulan`;
        const previousAnswers = drafts.get(group.age);
        questions.replaceChildren(...group.questions.map(question => {
          const item = template.content.cloneNode(true);
          const prompt = item.querySelector('.kpsp-prompt');
          prompt.id = `kpsp-prompt-${question.number}`;
          prompt.textContent = question.prompt;
          item.querySelector('fieldset').setAttribute('aria-describedby', prompt.id);
          item.querySelector('legend').textContent = `Pertanyaan ${question.number}`;
          item.querySelector('.kpsp-domain').textContent = data.domains[question.domain];

          for (const radio of item.querySelectorAll('input')) {
            radio.name = `kpsp-${question.number}`;
            radio.checked = previousAnswers?.get(radio.name) === radio.value;
          }

          if (question.image) {
            const figure = document.createElement('figure');
            figure.className = 'mt-3 space-y-1';
            const zoom = document.createElement('button');
            zoom.type = 'button';
            zoom.className = 'block w-full border border-divider rounded-md p-2 text-xs font-medium text-primary hover:bg-soft';
            const image = document.createElement('img');
            image.src = data.images[question.image.asset];
            image.alt = question.image.alt;
            image.loading = 'lazy';
            image.className = 'block mx-auto max-h-44 max-w-full object-contain';
            const zoomLabel = document.createElement('span');
            zoomLabel.className = 'block mt-1';
            zoomLabel.textContent = 'Perbesar ilustrasi';
            zoom.append(image, zoomLabel);
            zoom.addEventListener('click', () => {
              enlargedImage.src = image.src;
              enlargedImage.alt = image.alt;
              openAppDialog(imageDialog);
            });
            figure.append(zoom);

            if (question.image.reconstructed) {
              const caption = document.createElement('figcaption');
              caption.className = 'text-xs text-muted';
              caption.textContent = 'Ilustrasi rekonstruksi dari sumber DigiCare';
              figure.append(caption);
            }
            item.querySelector('.kpsp-question-image').append(figure);
          }
          return item;
        }));
        updateProgress();
        showView(form, focus ? questionnaireTitle : null);
        if (focus) saveKpsp('form');
      }

      function listItem(text) {
        const li = document.createElement('li');
        li.textContent = text;
        return li;
      }

      const ageButtons = new Map();
      for (const group of data.groups) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'min-w-0 min-h-16 rounded-lg border border-divider bg-surface px-1 pt-1 pb-2 text-xs font-semibold leading-tight text-ink hover:bg-soft hover:border-primary';
        const image = document.createElement('img');
        image.src = data.images[group.icon];
        image.alt = '';
        image.className = 'w-full aspect-[4/3] object-cover rounded';
        image.loading = 'lazy';
        const label = document.createElement('span');
        label.textContent = `${group.age} bulan`;
        button.append(image, label);
        button.addEventListener('click', () => openQuestionnaire(group));
        ageOptions.append(button);
        ageButtons.set(group.age, button);
      }

      function saveKpsp(stage) {
        if (!activeVisit) return;
        activeVisit.kpsp = {
          stage, age: activeGroup?.age ?? null,
          answers: Array.from(drafts, ([age, answers]) => [age, Object.fromEntries(answers)])
        };
        saveVisitStore();
      }

      form.addEventListener('change', () => {
        drafts.set(activeGroup.age, new Map(new FormData(form)));
        updateProgress();
        saveKpsp('form');
      });

      function paintResult(answers, focus) {
        const noByDomain = new Map();
        for (const question of activeGroup.questions) {
          if (answers.get(`kpsp-${question.number}`) === 'tidak') {
            const numbers = noByDomain.get(question.domain) ?? [];
            numbers.push(question.number);
            noByDomain.set(question.domain, numbers);
          }
        }
        const total = activeGroup.questions.length;
        const score = Array.from(answers.values()).filter(answer => answer === 'ya').length;
        const classification = kpspClassification(score);
        const outcome = data.outcomes[classification];

        document.getElementById('kpspResultAge').textContent = `Formulir ${activeGroup.age} bulan`;
        document.getElementById('kpspResultScore').textContent = `${score} / ${total}`;
        const category = document.getElementById('kpspResultCategory');
        category.textContent = `${outcome.label} (${classification})`;
        category.className = 'text-sm font-semibold ' + (classification === 'S'
          ? 'text-primary' : classification === 'P' ? 'text-danger' : 'text-ink');

        document.getElementById('kpspNoAnswers').classList.toggle('hidden', noByDomain.size === 0);
        document.getElementById('kpspNoAnswersList').replaceChildren(...Array.from(noByDomain, ([domain, numbers]) =>
          listItem(`${data.domains[domain]} · ${numbers.length} butir (no. ${numbers.join(', ')})`)
        ));
        document.getElementById('kpspRecommendations').replaceChildren(...outcome.advice.map(listItem));
        const guideLink = visitElement('kpspGuideLink');
        guideLink.onclick = () => {
          const findings = `KPSP ${activeGroup.age} bulan · ${score}/${total} · ${outcome.label}`;
          const domains = Array.from(noByDomain, ([domain, numbers]) => `${data.domains[domain]} (no. ${numbers.join(', ')})`);
          openGuideArticle('kpsp', guideLink, {
            route: ['S', 'M', 'P'].indexOf(classification), visitId: activeVisit?.id,
            findings: [findings, ...domains].join('\n'), includeFindings: true
          });
        };
        showView(result, focus ? resultTitle : null);
      }

      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!activeGroup || !form.reportValidity()) return;
        const answers = new Map(new FormData(form));
        drafts.set(activeGroup.age, answers);
        paintResult(answers, true);
        saveKpsp('result');
      });

      document.getElementById('btnChangeKpspAge').addEventListener('click', () => {
        showView(agePicker, ageButtons.get(activeGroup.age));
        saveKpsp('picker');
      });
      document.getElementById('btnEditKpspAnswers').addEventListener('click', () => {
        showView(form, questionnaireTitle);
        saveKpsp('form');
      });
      document.getElementById('btnFinishKpsp').addEventListener('click', () => {
        showView(agePicker, ageTitle);
        saveKpsp('picker');
      });
      imageDialog.addEventListener('close', () => enlargedImage.removeAttribute('src'));

      return () => {
        drafts.clear();
        activeGroup = null;
        questions.replaceChildren();
        showView(agePicker);
        const saved = activeVisit?.kpsp;
        if (!saved) return;
        for (const [age, answers] of saved.answers) drafts.set(age, new Map(Object.entries(answers)));
        const group = data.groups.find(item => item.age === saved.age);
        if (group && saved.stage !== 'picker') {
          openQuestionnaire(group, false);
          const answers = drafts.get(group.age);
          if (saved.stage === 'result' && answers?.size === group.questions.length) paintResult(answers, false);
        }
      };
    }

    function initDenverRecap() {
      const recap = document.getElementById('denverRecap');
      const form = document.getElementById('denverRecapForm');
      const findingsBox = document.getElementById('denverRecapFindings');
      const template = document.getElementById('denverRecapFindingTemplate');
      const addButton = document.getElementById('btnAddDenverFinding');
      const complete = document.getElementById('denverRecapComplete');
      const error = document.getElementById('denverRecapError');
      const result = document.getElementById('denverRecapResult');
      const resultTitle = document.getElementById('denverRecapResultTitle');
      const category = document.getElementById('denverRecapCategory');
      const details = document.getElementById('denverRecapDetails');

      function hideResult() {
        result.classList.add('hidden');
        error.classList.add('hidden');
        visitElement('denverGuideLink').onclick = null;
      }

      function invalidateRecap() {
        complete.checked = false;
        hideResult();
      }

      function makeFinding(saved) {
        const row = template.content.firstElementChild.cloneNode(true);
        const sectorSelect = row.querySelector('[name="denverSector"]');
        for (const sector of SECTORS) {
          sectorSelect.add(new Option(sector.label, sector.id));
        }
        row.querySelector('.denver-remove-finding').addEventListener('click', () => {
          row.remove();
          invalidateRecap();
          addButton.focus();
        });
        findingsBox.append(row);
        const item = row.querySelector('[name="denverItem"]');
        if (saved) {
          item.value = saved.item;
          sectorSelect.value = saved.sectorId;
          row.querySelector('[name="denverResponse"]').value = saved.response;
          row.querySelector('[name="denverPosition"]').value = saved.position;
        }
        return item;
      }

      addButton.addEventListener('click', () => {
        invalidateRecap();
        makeFinding().focus();
      });

      form.addEventListener('input', event => {
        if (event.target === complete) hideResult();
        else invalidateRecap();
      });

      form.addEventListener('submit', event => {
        event.preventDefault();
        hideResult();
        const age = calculateAge(currentProfile);
        if (!age || age.chartAge > 72 || !form.reportValidity()) return;

        const findings = [];
        const usedItems = new Set();
        for (const row of findingsBox.children) {
          const itemInput = row.querySelector('[name="denverItem"]');
          const item = itemInput.value.trim().replace(/\s+/g, ' ');
          const sector = SECTORS.find(entry => entry.id === row.querySelector('[name="denverSector"]').value);
          const response = row.querySelector('[name="denverResponse"]').value;
          const position = row.querySelector('[name="denverPosition"]').value;
          const key = `${sector.id}:${item.normalize('NFC').toLocaleLowerCase('id-ID')}`;

          if (!item || usedItems.has(key)) {
            error.textContent = item ? 'Butir ini sudah dicatat pada sektor yang sama.' : 'Isi nama butir seperti yang tertulis pada lembar.';
            error.classList.remove('hidden');
            itemInput.focus();
            return;
          }

          usedItems.add(key);
          findings.push({ item, sector, response, position });
        }

        activeVisit.denver = {
          version: 1, birthDate: currentProfile.birthDate, examDate: currentProfile.examDate,
          findings: findings.map(({ item, sector, response, position }) => ({ item, sectorId: sector.id, response, position }))
        };
        saveVisitStore();
        paintAssessment(findings);
        resultTitle.focus();
      });

      function paintAssessment(findings) {
        const assessment = interpretDenverRecap(findings);
        category.textContent = assessment.category;
        category.className = 'text-base font-semibold ' + (assessment.category === 'Normal' ? 'text-primary' : 'text-danger');
        document.getElementById('denverRecapReason').textContent = assessment.reason;
        document.getElementById('denverCautionCount').textContent = assessment.cautions;
        document.getElementById('denverDelayCount').textContent = assessment.delays;
        document.getElementById('denverRecapFollowUp').textContent = assessment.category === 'Normal'
          ? 'Lanjutkan skrining rutin pada kunjungan berikutnya.'
          : 'Skrining ulang dalam 1–2 minggu sesuai penilaian petugas.';
        details.replaceChildren(...findings.map(finding => {
          const entry = document.createElement('li');
          const flag = finding.position === 'delay' ? 'Delay' : 'Caution';
          entry.textContent = `${finding.sector.label} · ${finding.item} · ${flag} (${finding.response})`;
          return entry;
        }));

        const guideLink = visitElement('denverGuideLink');
        guideLink.onclick = () => openGuideArticle('denver', guideLink, {
          route: ['Normal', 'Suspect', 'Untestable'].indexOf(assessment.category), visitId: activeVisit?.id,
          findings: [`Denver II · ${assessment.category} · ${assessment.cautions} Caution · ${assessment.delays} Delay`,
            ...Array.from(details.children, item => item.textContent)].join('\n'),
          includeFindings: true
        });
        result.classList.remove('hidden');
      }

      return () => {
        recap.open = false;
        findingsBox.replaceChildren();
        details.replaceChildren();
        invalidateRecap();
        const age = calculateAge(currentProfile);
        const available = Boolean(age && age.chartAge <= 72);
        form.classList.toggle('hidden', !available);
        document.getElementById('denverRecapUnavailable').classList.toggle('hidden', !currentProfile || available);
        document.getElementById('denverRecapDemo').classList.toggle('hidden', !currentProfile?.isDemo);
        const saved = activeVisit?.denver;
        if (!saved || !available) return;
        saved.findings.forEach(makeFinding);
        if (saved.birthDate !== currentProfile.birthDate || saved.examDate !== currentProfile.examDate) {
          error.textContent = 'Tanggal lahir atau pemeriksaan berubah. Periksa kembali temuan dan garis umur sebelum menyelesaikan rekap.';
          error.classList.remove('hidden');
          return;
        }
        complete.checked = true;
        paintAssessment(saved.findings.map(finding => ({
          ...finding, sector: SECTORS.find(sector => sector.id === finding.sectorId)
        })));
      };
    }


    const GUIDE_REVIEW_DATE = '22 November 2026';
    const GUIDE_GROUPS = {
      child: 'Bayi & balita',
      school: 'Anak sekolah & remaja',
      maternal: 'Ibu hamil & nifas',
      adult: 'Dewasa',
      older: 'Lansia'
    };
    const GUIDE_SOURCES = {
      kia: ['Kemenkes · Buku KIA, edisi 2024', 'https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf'],
      imci: ['WHO · IMCI Chart Booklet, 2014', 'https://cdn.who.int/media/docs/default-source/mca-documents/child/imci-integrated-management-of-childhood-illness/imci-in-service-training/imci-chart-booklet.pdf'],
      anthropometry: ['Kemenkes · Permenkes 2/2020, Standar Antropometri Anak', 'https://peraturan.bpk.go.id/details/152505/permenkes-no-2-tahun-2020'],
      head: ['WHO · Child Growth Standards, Lingkar Kepala Menurut Umur', 'https://www.who.int/tools/child-growth-standards/standards/head-circumference-for-age'],
      nutrition: ['Kemenkes · Pedoman Pencegahan dan Tata Laksana Gizi Buruk pada Balita, 2019', 'https://repository.kemkes.go.id/book/186'],
      pmt: ['Kemenkes · Perdirjen Kesmas 1622/2023', 'https://jdih.kemkes.go.id/common/dokumen/2023Perdirjenkesmas1622.pdf'],
      ckg: ['Kemenkes · Kepmenkes 84/2026, Juknis Cek Kesehatan Gratis', 'https://jdih.kemkes.go.id/storage/documents/pdfs/2026kepmenkes084.pdf'],
      sdidtk: ['Kemenkes · Pedoman Pelaksanaan SDIDTK, edisi 2022', 'https://apgpaud.org/wp-content/uploads/2023/02/BUKU-PEDOMAN-SDIDTK-revisi-23082022.pdf'],
      denver: ['Frankenburg dkk. · The Denver II, Pediatrics 1992', 'https://pubmed.ncbi.nlm.nih.gov/1370185/'],
      denverManual: ['Denver Developmental Materials · Denver II Training Manual, 1992', 'https://books.google.com/books/about/Denver_II_Training_Manual.html?id=HTVpPQAACAAJ'],
      eye: ['Kemenkes · Ayo Sehat, Retinoblastoma', 'https://ayosehat.kemkes.go.id/retinoblastoma'],
      ilp: ['Kemenkes · Kepmenkes 2015/2023, Juknis Integrasi Pelayanan Kesehatan Primer', 'https://renbut.kemkes.go.id/regulasi/Buku%20KMK%20No%202015%20tahun%202023%20tentang%20Petunjuk%20Teknis%20ILP.pdf'],
      referral: ['Kemenkes · Permenkes 16/2024, Sistem Rujukan Pelayanan Kesehatan Perseorangan', 'https://peraturan.bpk.go.id/Download/368904/permenkes-no-16-tahun-2024.pdf'],
      bp: ['Kemenkes · Kepmenkes 303/2026, PNPK Hipertensi Dewasa', 'https://www.kemkes.go.id/id/pnpk-hipertensi-dewasa-kemenkes-2026'],
      stroke: ['Kemenkes · Kepmenkes 304/2026, PNPK Stroke', 'https://www.kemkes.go.id/id/national-clinical-guidelines-stroke-management-indonesia'],
      strokeSigns: ['Kemenkes · Kenali Stroke Iskemik dan Bertindak Cepat', 'https://keslan.kemkes.go.id/view_artikel/4465/kenali-stroke-iskemik-dan-bertindak-cepat'],
      icope: ['WHO · Integrated Care for Older People (ICOPE), edisi kedua, 2025', 'https://www.who.int/publications/i/item/9789240103726'],
      falls: ['WHO · Falls', 'https://www.who.int/en/news-room/fact-sheets/detail/falls']
    };

    const GUIDE_ARTICLES = [
      {
        id: 'neonatal', group: 'child', urgent: true, title: 'Tanda bahaya bayi baru lahir',
        scope: 'Bayi 0–28 hari', terms: 'neonatus kuning tidak menyusu kejang suhu biru',
        overview: 'Bayi baru lahir dapat memburuk cepat. Gangguan menyusu, napas, atau aktivitas bisa menyertai infeksi berat atau gangguan lain.',
        danger: 'Segera aktifkan alur penilaian neonatus bila bayi kejang, tampak biru, sulit bernapas, tidak mampu menyusu, sangat lemah, atau memiliki suhu tubuh abnormal. Kuning dalam 24 jam pertama perlu penilaian segera.',
        recognize: 'Tanyakan kapan tanda mulai dan kapan terakhir bayi menyusu. Catat suhu, warna, aktivitas, dan pola napas. Gunakan bagan Manajemen Terpadu Bayi Muda (MTBM).',
        initial: 'Jaga bayi tetap hangat dan lakukan penilaian serta tindakan pra-rujukan sesuai MTBM dan SOP. Hubungi jejaring layanan neonatal sambil menyiapkan transportasi.',
        routes: [['Darurat · fasilitas dengan layanan neonatal', 'Ikuti jalur neonatal setempat bila ada tanda bahaya. Sampaikan umur bayi, waktu mulai, temuan, dan tindakan awal.']],
        education: 'Tunjukkan tanda yang perlu langsung dilaporkan. Bawa Buku KIA bila tersedia.',
        refs: [['kia', 'Tanda Bahaya Pada Bayi Umur 0–28 Hari'], ['imci', 'Sick young infant, Assess and classify']]
      },
      {
        id: 'child-danger', group: 'child', urgent: true, title: 'Tanda bahaya pada bayi dan balita sakit',
        scope: 'Bayi dan balita. Gunakan MTBM untuk bayi di bawah 2 bulan.', terms: 'sesak demam muntah semua tidak bisa minum kejang letargis sianosis biru',
        overview: 'Tanda bahaya menandakan kebutuhan penilaian cepat. Penyebab dapat mencakup infeksi berat, gangguan pernapasan, atau dehidrasi berat.',
        danger: 'Aktifkan alur gawat darurat bila anak kejang, tidak sadar atau sulit dibangunkan, tampak biru, sangat sulit bernapas, tidak bisa minum atau menyusu, atau memuntahkan semua yang diminum.',
        recognize: 'Tanyakan kemampuan minum, muntah, kejang, waktu mulai, dan perubahan kesadaran. Nilai napas dan kondisi umum dengan bagan MTBS atau MTBM sesuai umur.',
        initial: 'Lakukan penilaian dan tindakan pra-rujukan sesuai SOP tanpa menunda transportasi. Laporkan tanda utama kepada fasilitas penerima.',
        routes: [['Darurat · fasilitas yang mampu menangani anak', 'Gunakan jejaring emergensi setempat. Jika tanda bahaya belum jelas tetapi anak tampak sangat sakit, minta penilaian petugas segera.']],
        education: 'Jelaskan tanda yang ditemukan dan alasan berangkat segera dengan bahasa yang dipahami keluarga.',
        refs: [['kia', 'Tanda Bahaya Pada Balita 29 Hari–5 Tahun'], ['imci', 'Sick child age 2 months up to 5 years, General danger signs']]
      },
      {
        id: 'growth', group: 'child', title: 'Membaca temuan pertumbuhan di luar acuan',
        scope: 'Usia sesuai kurva. LiLA untuk penapisan gizi akut pada 6–59 bulan.', terms: 'timbang berat badan kurang tidak naik pendek stunting z score bb/u pb tb imt obesitas lingkar kepala lila ukur ulang',
        overview: 'BB/U menilai berat menurut umur, PB/TB/U menilai panjang atau tinggi menurut umur, dan BB/PB/TB serta IMT/U menilai berat relatif terhadap ukuran tubuh. Lingkar kepala memiliki kurva tersendiri. Catat indikator bersama hasilnya.',
        danger: 'Jika anak sangat lemah, sulit minum, atau ada tanda bahaya umum, dahulukan penilaian segera. Gunakan panduan gizi akut bila hasil atau pemeriksaan mengarah ke gizi buruk.',
        recognize: 'Periksa tanggal lahir, tanggal ukur, jenis kelamin, satuan, alat, dan posisi ukur. Ulangi ukuran meragukan, termasuk lingkar kepala dengan pita sesuai. Bandingkan dengan riwayat dan pilih acuan yang sesuai usia.',
        initial: 'Catat angka asli dan tren. Tanyakan pola makan, penyakit baru, dan keluhan lain. Jika data kosong, di luar cakupan, atau ditandai perlu diperiksa, mulai dari verifikasi pengukuran.',
        routes: [
          ['Puskesmas · konfirmasi hasil', 'Bawa hasil ukur ulang dan riwayat saat ditemukan berat kurang, pendek, atau tren menyimpang untuk penilaian sesuai pedoman.'],
          ['Fasilitas tingkat lanjut · sesuai hasil penilaian', 'Temuan seperti dugaan kelainan lingkar kepala yang terkonfirmasi atau obesitas perlu penilaian lanjutan sesuai pedoman dan jenis layanan yang dibutuhkan.']
        ],
        education: 'Jelaskan arti indikator dan sepakati kapan ukur ulang. Minta keluarga membawa Buku KIA untuk membandingkan riwayat.',
        refs: [['anthropometry', 'Lampiran, kategori dan ambang batas indeks'], ['head', 'Kurva lingkar kepala menurut umur'], ['ckg', 'Tindak lanjut balita dan anak prasekolah, bagian Pertumbuhan']]
      },
      {
        id: 'acute-nutrition', group: 'child', urgent: true, title: 'Dugaan gizi akut atau edema pada balita',
        scope: 'Balita. Ambang LiLA berlaku pada umur 6–59 bulan.', terms: 'wasting gizi buruk gizi kurang kurus lila muac edema bengkak kedua kaki nafsu makan',
        overview: 'Temuan yang perlu dinilai antara lain BB/PB atau BB/TB di bawah −3 SD, LiLA di bawah 11,5 cm pada 6–59 bulan, atau edema pada kedua punggung kaki.',
        danger: 'Tanda bahaya umum atau dugaan komplikasi memerlukan penilaian dan rujukan segera. Verifikasi adanya edema dan apakah mengenai kedua kaki.',
        recognize: 'Ulangi ukuran yang meragukan dan cek usia. Catat kemampuan minum, nafsu makan, dan temuan edema. Bayi di bawah 6 bulan memakai penilaian khusus sesuai pedoman.',
        initial: 'Koordinasikan penilaian dengan Puskesmas atau layanan gizi buruk. Sampaikan hasil dan kondisi klinis, termasuk tanda yang membutuhkan perhatian segera.',
        routes: [
          ['Puskesmas · konfirmasi dan penilaian komplikasi', 'Jika stabil, koordinasikan penilaian dan keputusan rawat jalan sesuai pedoman serta kemampuan fasilitas.'],
          ['Rumah sakit · penilaian segera bila ada komplikasi', 'Gunakan jalur setempat jika ada komplikasi medis atau kebutuhan rawat inap.']
        ],
        education: 'Jelaskan alasan pemeriksaan lanjutan dan kapan perlu segera mencari pertolongan. Minta keluarga membawa hasil ukur serta catatan pola makan.',
        refs: [['nutrition', 'Penapisan, konfirmasi, rawat jalan dan rawat inap'], ['pmt', 'Definisi operasional gizi buruk dan konfirmasi antropometri']]
      },
      {
        id: 'kpsp', group: 'child', title: 'Tindak lanjut hasil KPSP',
        scope: 'Formulir usia 3–72 bulan sesuai pedoman', terms: 'meragukan penyimpangan sesuai perkembangan bicara motorik',
        overview: 'KPSP menyaring kebutuhan penilaian perkembangan lebih lanjut. Rincian jawaban “Tidak” menunjukkan ranah yang perlu ditinjau bersama pengasuh.',
        danger: 'Sampaikan keluhan kehilangan kemampuan yang sudah dikuasai untuk penilaian klinis. Jika ada tanda bahaya akut, gunakan alur kegawatdaruratan.',
        recognize: 'Cek umur formulir, termasuk umur koreksi bila diperlukan, kelengkapan, dan ranah jawaban “Tidak”. Tanyakan contoh kemampuan anak di rumah serta kendala saat pemeriksaan.',
        initial: 'Peragakan stimulasi sesuai kemampuan yang perlu dilatih. Untuk hasil meragukan, pertimbangkan pemeriksaan kesehatan sesuai temuan.',
        routes: [
          ['Sesuai umur', 'Lanjutkan stimulasi sesuai usia dan skrining rutin.'],
          ['Meragukan', 'Lakukan stimulasi terarah dan penilaian ulang dalam dua minggu. Bila hasil evaluasi tetap meragukan atau menunjukkan kemungkinan penyimpangan, arahkan ke fasilitas tingkat lanjut.'],
          ['Kemungkinan penyimpangan', 'Dokumentasikan nomor dan ranah jawaban “Tidak”. Koordinasikan penilaian di fasilitas tingkat lanjut dengan layanan tumbuh kembang anak.']
        ],
        education: 'Peragakan satu kegiatan yang bisa diulang di rumah. Sepakati jadwal evaluasi dan cara keluarga mencatat kemajuan.',
        refs: [['sdidtk', 'KPSP, interpretasi dan intervensi, hlm. 118–120'], ['ckg', 'Tabel tindak lanjut, bagian Perkembangan']]
      },
      {
        id: 'denver', group: 'child', title: 'Memahami rekap Denver II',
        scope: 'Usia dan kondisi pemeriksaan sesuai manual', terms: 'suspect untestable normal caution delay denver ii skrining',
        overview: 'Denver II menyaring perkembangan anak. Rekap merangkum temuan pemeriksaan yang dicatat dari lembar resmi.',
        danger: 'Sampaikan keluhan kehilangan kemampuan yang sudah dikuasai untuk penilaian klinis. Bila ada tanda bahaya akut, gunakan alur kegawatdaruratan.',
        recognize: 'Periksa garis umur, posisi butir, dan respons. Catat kendala seperti sakit, lelah, atau penolakan.',
        initial: 'Bahas temuan dengan pengasuh dan ikuti prosedur pemeriksaan ulang dari manual. Pertimbangkan keluhan keluarga bersama hasil skrining.',
        routes: [
          ['Normal', 'Lanjutkan pemantauan rutin dan pertimbangkan keluhan keluarga bila ada.'],
          ['Suspect', 'Tinjau Delay dan Caution. Ikuti jadwal skrining ulang pada manual. Minta penilaian klinis jika temuan menetap atau ada kekhawatiran yang memerlukan evaluasi.'],
          ['Untestable', 'Tinjau butir yang ditolak dan kondisi pemeriksaan. Ikuti manual untuk pemeriksaan ulang dan pertimbangkan penilaian lanjutan jika hasil tetap tidak dapat dinilai.']
        ],
        education: 'Jelaskan kemampuan yang teramati dan ajak pengasuh melaporkan kemampuan sehari-hari.',
        refs: [['denver', 'Tujuan dan pengembangan instrumen'], ['denverManual', 'Interpretasi dan tindak lanjut, akses melalui manual berlisensi']]
      },
      {
        id: 'white-pupil', group: 'child', urgent: true, title: 'Pupil putih pada anak (leukokoria)',
        scope: 'Bayi dan anak, termasuk temuan yang dilaporkan pengasuh', terms: 'mata kucing putih foto pantulan refleks merah katarak retinoblastoma spesialis mata',
        overview: 'Pupil putih adalah pantulan putih di tengah mata yang kadang terlihat pada foto. Katarak anak dan retinoblastoma termasuk kondisi yang perlu diperiksa.',
        danger: 'Pantulan putih pada satu atau kedua mata atau dugaan refleks merah abnormal memerlukan penilaian mata segera.',
        recognize: 'Catat sisi, kapan terlihat, dan apakah berulang. Tanyakan keluhan penglihatan atau mata juling. Pemeriksaan refleks merah mengikuti pedoman dan kewenangan petugas.',
        initial: 'Koordinasikan pemeriksaan mata dan sampaikan tanda yang terlihat. Pengasuh dapat menunjukkan foto yang sudah ada.',
        routes: [['Segera · layanan spesialis mata', 'Koordinasikan pemeriksaan di rumah sakit atau fasilitas tingkat lanjut dengan dokter spesialis mata sesuai jejaring setempat.']],
        education: 'Jelaskan bahwa beberapa kondisi bisa menimbulkan pantulan putih. Pemeriksaan mata diperlukan untuk mengetahui penyebabnya.',
        refs: [['sdidtk', 'Refleks merah dan pupil putih, hlm. 153–155'], ['ckg', 'Tindak lanjut mata pada anak'], ['eye', 'Tanda, deteksi, dan rujukan']]
      },
      {
        id: 'school-mental-health', group: 'school', urgent: true, title: 'Temuan kesehatan jiwa pada anak sekolah dan remaja',
        scope: 'Anak usia sekolah dan remaja. Pilih instrumen sesuai usia.', terms: 'sedih cemas stres sulit tidur depresi sdq psikolog mental',
        overview: 'Perubahan suasana hati, perilaku, atau fungsi sehari-hari dapat menjadi alasan penilaian lanjutan. Tinjau skrining bersama wawancara dan konteks anak.',
        danger: 'Bila ada ancaman menyakiti diri atau orang lain saat ini, utamakan keselamatan, dampingi anak, dan aktifkan penilaian darurat sesuai SOP.',
        recognize: 'Tanyakan secara privat pengaruh keluhan terhadap tidur, aktivitas, dan sekolah. Catat durasi dan dukungan yang tersedia.',
        initial: 'Dengarkan tanpa menghakimi. Bahas langkah yang dapat dilakukan dengan anak dan pengasuh sambil menjaga privasi dan keselamatan.',
        routes: [
          ['Puskesmas · evaluasi lanjutan', 'Hasil meragukan atau abnormal dan keluhan yang mengganggu fungsi perlu ditinjau tenaga yang kompeten.'],
          ['RS atau layanan kesehatan jiwa · sesuai evaluasi', 'Tim kesehatan menentukan kebutuhan layanan lanjutan. Gunakan alur darurat jika ada bahaya akut.']
        ],
        education: 'Sepakati waktu tindak lanjut dan cara menghubungi bantuan. Gunakan bahasa yang menghormati anak dan keluarga.',
        refs: [['ilp', 'Klaster ibu dan anak, skrining dan tindak lanjut kesehatan jiwa anak sekolah dan remaja']]
      },
      {
        id: 'pregnancy-danger', group: 'maternal', urgent: true, title: 'Tanda bahaya pada kehamilan',
        scope: 'Trimester 1–3', terms: 'hamil perdarahan kejang preeklampsia sakit kepala pandangan kabur ketuban gerak janin',
        overview: 'Perdarahan, gangguan tekanan darah, atau masalah janin termasuk kemungkinan yang perlu dinilai. Perhatikan usia kehamilan.',
        danger: 'Perdarahan, kejang, sesak berat, atau penurunan kesadaran memerlukan penanganan segera. Nyeri perut hebat, sakit kepala berat dengan gangguan penglihatan, atau gerak janin berkurang juga perlu segera dinilai sesuai tahap kehamilan.',
        dangerDetails: [
          ['Trimester 1', 'Antara lain perdarahan, nyeri perut hebat, muntah berat, atau demam tinggi.'],
          ['Trimester 2', 'Antara lain pandangan kabur, sakit kepala berat, atau cairan yang keluar banyak atau berbau dari jalan lahir.'],
          ['Trimester 3', 'Antara lain gerak janin berkurang, ketuban pecah, atau nyeri perut hebat di antara kontraksi.']
        ],
        recognize: 'Catat trimester dan waktu mulai keluhan. Tanyakan perdarahan, cairan keluar, nyeri, serta perubahan gerak janin bila sudah biasa dirasakan.',
        initial: 'Aktifkan jalur maternal setempat. Nilai kondisi awal sesuai SOP dan koordinasikan transportasi serta komunikasi dengan fasilitas penerima.',
        routes: [['Segera · jejaring obstetri', 'Pilih fasilitas yang mampu menangani temuan. Untuk kegawatdaruratan, koordinasikan dengan layanan emergensi obstetri.']],
        education: 'Jelaskan alasan pemeriksaan segera. Ajak pendamping membantu transportasi dan membawa Buku KIA bila tersedia.',
        refs: [['kia', 'Tanda Bahaya pada Trimester 1, 2, dan 3, hlm. 8, 16–17, dan 20'], ['referral', 'Pasal 6 dan 14–16, rujukan gawat darurat']]
      },
      {
        id: 'postpartum-danger', group: 'maternal', urgent: true, title: 'Tanda bahaya setelah melahirkan',
        scope: 'Ibu pada masa nifas', terms: 'nifas postpartum melahirkan perdarahan banyak demam infeksi kejang',
        overview: 'Perdarahan, infeksi, dan gangguan tekanan darah pada masa nifas dapat memerlukan penanganan segera.',
        danger: 'Perdarahan banyak, kejang, sesak berat, atau penurunan kesadaran memerlukan respons darurat. Demam, cairan berbau, atau sakit kepala berat perlu segera dinilai.',
        recognize: 'Catat waktu sejak persalinan dan sejak keluhan muncul. Tanyakan perubahan perdarahan, cairan, nyeri, dan demam.',
        initial: 'Lakukan penilaian awal sesuai SOP maternal. Hubungi jejaring dan atur transportasi tanpa menunggu pencatatan lengkap.',
        routes: [['Segera · Puskesmas atau RS sesuai kondisi', 'Untuk kondisi gawat, koordinasikan penanganan melalui layanan emergensi obstetri.']],
        education: 'Sampaikan tanda yang perlu dilaporkan cepat dan libatkan pendamping untuk membantu akses ke fasilitas.',
        refs: [['kia', 'Tanda Bahaya Pada Ibu Setelah Melahirkan (Nifas)']]
      },
      {
        id: 'adult-bp', group: 'adult', title: 'Tekanan darah tinggi saat skrining',
        scope: 'Dewasa di luar kehamilan dan masa nifas', terms: 'tensi hipertensi tekanan darah ukur ulang',
        overview: 'Tekanan darah tinggi saat skrining perlu dikonfirmasi. Aktivitas, nyeri, manset, atau posisi dapat memengaruhi hasil.',
        danger: 'Nyeri dada, sesak berat, kelemahan mendadak satu sisi, gangguan bicara, atau penurunan kesadaran memerlukan penilaian darurat.',
        recognize: 'Catat angka, teknik, keadaan saat ukur, obat rutin, dan gejala. Bila stabil, beri waktu beristirahat dan ukur ulang dengan manset serta posisi sesuai standar.',
        initial: 'Jika stabil, jelaskan hasil skrining dan atur evaluasi di Puskesmas. Catat hasil untuk dibawa saat pemeriksaan lanjutan.',
        routes: [
          ['Puskesmas · konfirmasi dan tindak lanjut', 'Bila pengukuran ulang pada kondisi stabil masih menunjukkan sistolik ≥140 mmHg atau diastolik ≥90 mmHg, arahkan untuk konfirmasi di Puskesmas. Tekanan darah pasien dengan hipertensi yang belum terkendali juga perlu ditinjau.'],
          ['Darurat · bila ada tanda akut', 'Aktifkan alur gawat darurat. Sampaikan gejala, waktu mulai, dan hasil pengukuran yang tersedia.']
        ],
        education: 'Bahas cara mencatat tekanan darah, kontrol berkala, dan kebiasaan hidup sehat. Penyesuaian obat dibahas dengan dokter yang menangani.',
        refs: [['ilp', 'Klaster dewasa, tindak lanjut skrining hipertensi'], ['bp', 'Pengukuran, diagnosis, dan hipertensi emergensi']]
      },
      {
        id: 'stroke-signs', group: 'adult', groups: ['adult', 'older'], urgent: true, title: 'Gejala stroke mendadak',
        scope: 'Dewasa, termasuk lansia', terms: 'stroke segera ke rs wajah mencong senyum tidak simetris pelo lemah satu sisi lumpuh',
        overview: 'Stroke bisa muncul tiba-tiba. Penilaian cepat di fasilitas dengan kemampuan menangani stroke membantu menentukan terapi yang sesuai.',
        danger: 'Wajah mencong, satu sisi tubuh lemah, atau bicara pelo atau sulit bicara yang muncul mendadak merupakan tanda darurat. Aktifkan jalur kegawatdaruratan walau gejala mereda.',
        recognize: 'Catat waktu mulai. Bila belum diketahui, catat kapan pasien terakhir terlihat seperti biasa. Sampaikan waktu dan gejala ke fasilitas penerima.',
        initial: 'Nilai kondisi awal sesuai SOP dan koordinasikan transportasi. Hindari memberi makan atau minum bila kemampuan menelan belum dinilai.',
        routes: [['Darurat · IGD dengan kemampuan penanganan stroke', 'Gunakan jejaring stroke setempat. Utamakan keberangkatan dan komunikasi kondisi pasien.']],
        education: 'Jelaskan bahwa gejala mendadak seperti wajah mencong, satu sisi lemah, atau bicara berubah membutuhkan pertolongan segera.',
        refs: [['stroke', 'Pengenalan dan alur pra-rumah sakit'], ['strokeSigns', 'Gejala mendadak dan tindakan segera']]
      },
      {
        id: 'older-mobility', group: 'older', title: 'Mobilitas menurun atau jatuh berulang pada lansia',
        scope: 'Lansia, terutama bila aktivitas sehari-hari terganggu', terms: 'lansia jatuh keseimbangan jalan mobilitas adl aks skilas',
        overview: 'Jatuh berulang atau makin sulit berjalan dapat berkaitan dengan kekuatan, keseimbangan, penglihatan, obat, atau kondisi medis.',
        danger: 'Penurunan kesadaran, kecurigaan cedera berat, atau perubahan saraf mendadak setelah jatuh memerlukan penilaian darurat.',
        recognize: 'Tanyakan kejadian jatuh, cedera, pusing, penggunaan obat dan alat bantu, serta perubahan aktivitas. Gunakan penilaian fungsi sesuai program.',
        initial: 'Bila stabil, catat kemampuan berjalan dan bantuan yang diperlukan. Diskusikan penerangan dan hambatan di jalur berjalan di rumah.',
        routes: [
          ['Pustu atau Puskesmas · penilaian fungsi', 'Atur penilaian lanjutan bila fungsi menurun, ada ketergantungan, atau jatuh berulang.'],
          ['Darurat · bila dicurigai cedera berat', 'Lakukan penilaian awal dan koordinasikan rujukan sesuai SOP.']
        ],
        education: 'Sepakati langkah pencegahan jatuh dan bantuan yang dibutuhkan saat beraktivitas bersama keluarga.',
        refs: [['ilp', 'Klaster lansia, tindak lanjut ADL/AKS dan SKILAS'], ['icope', 'Locomotor capacity and mobility care pathway'], ['falls', 'Faktor risiko dan pencegahan pada lansia']]
      }
    ];

    let guideContext = null;

    function guideElement(tag, text, className) {
      const element = document.createElement(tag);
      if (text) element.textContent = text;
      if (className) element.className = className;
      return element;
    }

    function normalizeGuideSearch(value) {
      return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('id-ID')
        .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    }

    const GUIDE_SEARCH = GUIDE_ARTICLES.map(article => ({
      article,
      headline: normalizeGuideSearch(article.title + ' ' + article.terms),
      text: normalizeGuideSearch([
        article.scope, GUIDE_GROUPS[article.group], article.overview, article.danger,
        article.recognize, article.initial, article.education, ...article.routes.flat()
      ].join(' '))
    }));

    function renderGuideLibrary() {
      const query = normalizeGuideSearch(visitElement('guideQuery').value);
      const words = query ? query.split(' ') : [];
      const group = visitElement('guideAgeFilter').value;
      const urgent = visitElement('guideDangerToggle').getAttribute('aria-pressed') === 'true';
      const matches = GUIDE_SEARCH.filter(({ article, headline, text }) =>
        (!group || (article.groups ?? [article.group]).includes(group)) &&
        (!urgent || article.urgent) &&
        words.every(word => headline.includes(word) || text.includes(word))
      );
      if (query) {
        matches.sort((a, b) =>
          words.filter(word => b.headline.includes(word)).length -
          words.filter(word => a.headline.includes(word)).length
        );
      }
      const list = visitElement('guideList');
      list.replaceChildren(...matches.map(({ article }) => {
        const entry = guideElement('li');
        const button = guideElement('button', '', 'guide-card');
        button.type = 'button';
        button.dataset.article = article.id;
        const copy = guideElement('span');
        copy.append(guideElement('strong', article.title), guideElement('small', GUIDE_GROUPS[article.group]));
        const arrow = guideElement('span', '›', 'text-primary');
        arrow.setAttribute('aria-hidden', 'true');
        button.append(copy, arrow);
        button.addEventListener('click', () => openGuideArticle(article.id, button));
        entry.append(button);
        return entry;
      }));
      visitElement('guideCount').textContent = matches.length
        ? matches.length + ' artikel'
        : 'Tidak ada artikel yang cocok. Ubah kata kunci atau kelompok usia.';
    }

    function showGuideLibrary() {
      guideContext = null;
      visitElement('guideArticle').classList.add('hidden');
      visitElement('guideArticleBody').replaceChildren();
      visitElement('guideMakeReferral').classList.add('hidden');
      visitElement('guideLibrary').classList.remove('hidden');
    }

    function guideSection(title, content, className = '') {
      const section = guideElement('section', '', ('guide-section ' + className).trim());
      section.append(guideElement('h3', title), typeof content === 'string' ? guideElement('p', content) : content);
      return section;
    }

    function openGuideArticle(id, trigger, context = {}) {
      const article = GUIDE_ARTICLES.find(entry => entry.id === id);
      if (!article) return;
      const sourceTab = document.querySelector('.nav-tab-btn[aria-selected="true"]').dataset.tab;
      switchTab('panduan');
      guideContext = { article, sourceTab, trigger, ...context };
      visitElement('guideLibrary').classList.add('hidden');
      visitElement('guideArticle').classList.remove('hidden');
      visitElement('guideBack').textContent = sourceTab === 'panduan' ? '← Daftar artikel' : '← Hasil pemeriksaan';
      visitElement('guideArticleTitle').textContent = article.title;
      visitElement('guideArticleGroup').textContent = GUIDE_GROUPS[article.group];
      visitElement('guideArticleScope').textContent = article.scope;

      const body = visitElement('guideArticleBody');
      const warning = guideSection('Tanda bahaya dan tindakan segera', article.danger, 'guide-alert');
      if (article.dangerDetails) {
        const examples = guideElement('ul');
        for (const [label, text] of article.dangerDetails) {
          const item = guideElement('li');
          item.append(guideElement('strong', label + ' · '), text);
          examples.append(item);
        }
        warning.append(examples);
      }
      body.replaceChildren(warning);
      if (context.findings) body.append(guideElement('p', context.findings, 'guide-result-context'));

      const routes = guideElement('div');
      const orderedRoutes = article.routes.map((route, index) => ({ route, index }));
      if (context.route !== undefined) orderedRoutes.unshift(...orderedRoutes.splice(context.route, 1));
      for (const { route: [title, text], index } of orderedRoutes) {
        const row = guideElement('div', '', 'guide-route');
        row.classList.toggle('is-current', index === context.route);
        if (index === context.route) row.append(guideElement('p', 'Sesuai hasil yang dibuka', 'text-xs font-semibold text-muted'));
        row.append(guideElement('strong', title), guideElement('p', text));
        routes.append(row);
      }
      const nextSteps = guideSection('Tindak lanjut dan tujuan rujukan', routes);
      if (context.route !== undefined) body.append(nextSteps);
      body.append(
        guideSection('Gambaran umum', article.overview),
        guideSection('Kenali dan periksa ulang', article.recognize),
        guideSection('Penanganan awal', article.initial)
      );
      if (context.route === undefined) body.append(nextSteps);
      body.append(guideSection('Edukasi keluarga', article.education));

      const references = guideElement('div');
      const list = guideElement('ul', '', 'guide-sources');
      for (const [key, location] of article.refs) {
        const [label, url] = GUIDE_SOURCES[key];
        const entry = guideElement('li');
        const link = guideElement('a', label);
        link.href = url;
        link.rel = 'noopener noreferrer';
        entry.append(link, guideElement('p', location, 'text-xs text-muted'));
        list.append(entry);
      }
      references.append(list, guideElement('p', 'Pemeriksaan sumber · ' + GUIDE_REVIEW_DATE, 'mt-2 text-xs text-muted'));
      body.append(guideSection('Sumber', references));
      updateGuideReferralButton();
      visitElement('guideArticleTitle').focus({ preventScroll: true });
    }

    function returnFromGuide() {
      const { sourceTab, trigger } = guideContext;
      showGuideLibrary();
      if (sourceTab !== 'panduan') switchTab(sourceTab);
      if (trigger.isConnected) trigger.focus();
    }

    const GROWTH_EXPECTED_STATUS = {
      wfa: 'Berat badan normal',
      length: 'Normal',
      proportion: 'Gizi baik',
      bmi: 'Gizi baik',
      hcfa: 'Dalam rentang −2 hingga +2 SD',
      arm: '12,5 cm atau lebih'
    };

    function updateGrowthGuide(key, info, visit, age) {
      const button = visitElement('growthGuideLink');
      const oedema = visit.measures.oedema === true;
      const needsVerification = key === 'arm'
        ? info.value === null || info.status.startsWith('Ukuran tercatat')
        : info.z === undefined;
      const show = oedema || needsVerification || info.status !== GROWTH_EXPECTED_STATUS[key];
      button.classList.toggle('hidden', !show);
      button.onclick = null;
      if (!show) return;
      const nutrition = age.fullMonths < 60 && (oedema || (key === 'proportion' && info.status === 'Gizi buruk') ||
        (key === 'arm' && info.status === 'Di bawah 11,5 cm'));
      const findings = oedema
        ? 'Edema bilateral tercatat oleh petugas.'
        : info.label + ' · ' + growthValueText(info) + ' · ' +
          (info.z === undefined ? '' : growthScoreText(info.z) + ' · ') + info.status;
      button.textContent = needsVerification && !nutrition ? 'Panduan periksa ulang pengukuran' : 'Lihat panduan tindak lanjut';
      button.onclick = () => openGuideArticle(nutrition ? 'acute-nutrition' : 'growth', button, {
        findings: formatDateId(visit.examDate) + ' · ' + findings,
        visitId: visit.id,
        includeFindings: nutrition || !needsVerification
      });
    }

    function isChildVisit(visit, child) {
      if (!visit || !child) return false;
      const age = calculateAge({ birthDate: child.birthDate, examDate: visit.examDate });
      return Boolean(age && age.fullMonths < 18 * 12);
    }

    function guideReferralVisit() {
      if (!guideContext || !['child', 'school'].includes(guideContext.article.group)) return null;
      const visit = guideContext.visitId ? visitStore.visits.find(entry => entry.id === guideContext.visitId) : activeVisit;
      return isChildVisit(visit, activeChild) && visit.childId === activeChild.id ? visit : null;
    }

    function updateGuideReferralButton() {
      const button = visitElement('guideMakeReferral');
      const visit = guideReferralVisit();
      button.classList.toggle('hidden', !visit);
      if (visit) button.textContent = 'Buat ringkasan untuk ' + activeChild.name;
    }

    let referralVisitId = null;
    let editingReferralId = null;

    function showReferralList() {
      const visit = visitStore.visits.find(entry => entry.id === referralVisitId);
      const host = visitElement('referralRecords');
      const records = visit.referrals ?? [];
      host.replaceChildren();
      host.classList.remove('hidden');
      visitElement('referralForm').classList.add('hidden');
      if (!records.length) host.append(guideElement('p', 'Belum ada ringkasan pada kunjungan ini.', 'text-sm text-muted'));
      for (const record of records) {
        const row = guideElement('button', '', 'guide-secondary text-left');
        row.type = 'button';
        row.append(guideElement('strong', record.destination + ' · ' + record.unit, 'block break-words'),
          guideElement('span', record.urgency + ' · ' + record.reason, 'block text-xs text-muted break-words'));
        row.addEventListener('click', () => showReferralForm(record));
        host.append(row);
      }
      const create = guideElement('button', 'Buat ringkasan', 'guide-primary');
      create.type = 'button';
      create.addEventListener('click', () => showReferralForm());
      host.append(create);
      if (visitElement('referralDialog').open) host.querySelector('button')?.focus();
    }

    function showReferralForm(record = {}) {
      const form = visitElement('referralForm');
      form.reset();
      editingReferralId = record.id ?? null;
      for (const field of form.querySelectorAll('[name]')) {
        field.value = record[field.name] ?? '';
        field.setCustomValidity('');
      }
      visitElement('referralStatus').textContent = '';
      visitElement('referralRecords').classList.add('hidden');
      form.classList.remove('hidden');
      if (visitElement('referralDialog').open) {
        form.closest('.app-dialog-body').scrollTop = 0;
        visitElement('referralClose').focus({ preventScroll: true });
      }
    }

    function openReferralDialog(visit, preset) {
      if (!isChildVisit(visit, activeChild) || visit.childId !== activeChild.id) return;
      const dialog = visitElement('referralDialog');
      referralVisitId = visit.id;
      visitElement('referralVisitLabel').textContent = activeChild.name + ' · ' + formatDateId(visit.examDate);
      if (preset) showReferralForm(preset);
      else showReferralList();
      openAppDialog(dialog);
    }

    let referralSaving = false;

    async function saveReferral(event) {
      event.preventDefault();
      if (referralSaving) return;
      const visit = visitStore.visits.find(entry => entry.id === referralVisitId);
      if (!isChildVisit(visit, activeChild) || visit.childId !== activeChild.id) return;
      const form = event.currentTarget;
      const print = event.submitter?.value === 'print';
      const status = visitElement('referralStatus');
      const fields = {};
      for (const field of form.querySelectorAll('[name]')) {
        fields[field.name] = field.value.trim();
        if (field.required && !fields[field.name]) {
          field.setCustomValidity('Lengkapi bagian ini.');
          field.reportValidity();
          return;
        }
      }
      const record = { id: editingReferralId ?? newVisitId(), ...fields };
      const records = visit.referrals ?? [];
      visit.referrals = editingReferralId
        ? records.map(item => item.id === editingReferralId ? record : item)
        : [...records, record];
      editingReferralId = record.id;
      referralSaving = true;
      const buttons = form.querySelectorAll('button');
      buttons.forEach(button => { button.disabled = true; });
      try {
        if (!await saveVisitStore()) {
          status.textContent = 'Ringkasan belum tersimpan. Isian masih tersedia di formulir ini.';
          return;
        }
        status.textContent = 'Ringkasan tersimpan di perangkat ini.';
        if (print) await visitPersistence.print(visit.id, record.id);
      } catch (error) {
        status.textContent = 'Ringkasan tersimpan. ' + error.message;
      } finally {
        referralSaving = false;
        buttons.forEach(button => { button.disabled = false; });
      }
    }

    function initGuide() {
      const filter = visitElement('guideAgeFilter');
      for (const [key, label] of Object.entries(GUIDE_GROUPS)) filter.add(new Option(label, key));
      filter.addEventListener('change', renderGuideLibrary);
      visitElement('guideQuery').addEventListener('input', renderGuideLibrary);
      const danger = visitElement('guideDangerToggle');
      danger.addEventListener('click', () => {
        const showUrgent = danger.getAttribute('aria-pressed') === 'false';
        danger.setAttribute('aria-pressed', String(showUrgent));
        if (showUrgent) visitElement('guideQuery').value = '';
        renderGuideLibrary();
      });
      visitElement('guideBack').addEventListener('click', returnFromGuide);
      visitElement('guideMakeReferral').addEventListener('click', () => {
        const visit = guideReferralVisit();
        if (visit) openReferralDialog(visit, { findings: guideContext.includeFindings ? guideContext.findings : '' });
      });
      visitElement('btnOpenReferralRecords').addEventListener('click', () => openReferralDialog(activeVisit));
      visitElement('referralToList').addEventListener('click', showReferralList);
      const form = visitElement('referralForm');
      form.addEventListener('input', event => {
        event.target.setCustomValidity('');
        visitElement('referralStatus').textContent = '';
      });
      form.addEventListener('submit', saveReferral);
      renderGuideLibrary();
    }

    document.addEventListener('DOMContentLoaded', () => {
      initAppDialogs();
      initSheetImageAndGestures();
      initGuide();
      restoreKpsp = initKpsp();
      resetDenverForVisit = initDenverRecap();
      resetDenverForVisit();

      document.querySelectorAll('.nav-tab-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
      document.querySelectorAll('.nav-shortcut-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.targetTab)));

      document.querySelectorAll('[data-service-tab]').forEach(button =>
        button.addEventListener('click', () => switchTab(button.dataset.serviceTab)));

      visitElement('btnOpenAgeEmpty').addEventListener('click', () => openAgeModal('child'));
      visitElement('btnNewChild').addEventListener('click', () => openAgeModal('child'));
      visitElement('btnNewVisit').addEventListener('click', () => openAgeModal('next'));
      visitElement('btnHdrChangeAge').addEventListener('click', () => openAgeModal());
      visitElement('btnHeaderSources').addEventListener('click', openSources);
      document.querySelectorAll('.trigger-age-modal').forEach(b => b.addEventListener('click', () => openAgeModal()));
      visitElement('btnVisitProfileBack').addEventListener('click', () => showVisitStep(false));
      visitElement('btnContinueKpsp').addEventListener('click', () => {
        switchTab('perkembangan');
        visitElement('btnViewKpsp').click();
      });
      visitElement('growthIndicator').addEventListener('change', () => {
        if (activeVisit) renderGrowthChart();
      });
      visitElement('btnTryDemoNara').addEventListener('click', applyVisitDemo);
      visitElement('btnApplyDemoNaraModal').addEventListener('click', applyVisitDemo);
      document.querySelectorAll('.btn-apply-demo-inline').forEach(b => b.addEventListener('click', applyVisitDemo));
      visitElement('ageForm').addEventListener('submit', saveVisitForm);

      const developmentViewButtons = document.querySelectorAll('#developmentViewSwitcher button[aria-controls]');
      developmentViewButtons.forEach(button => {
        button.addEventListener('click', () => {
          const viewId = button.getAttribute('aria-controls');
          developmentViewButtons.forEach(viewButton => {
            const selected = viewButton === button;
            const panel = document.getElementById(viewButton.getAttribute('aria-controls'));
            panel.classList.toggle('hidden', !selected);
            viewButton.setAttribute('aria-pressed', String(selected));
            viewButton.className = 'min-h-10 rounded-md px-1 ' + (selected
              ? 'bg-surface text-ink font-semibold border border-divider'
              : 'text-muted font-normal hover:text-ink');
          });

          if (viewId === 'viewChartArea') {
            const age = calculateAge(currentProfile);
            if (age) renderDenverSheetView(age);
            requestAnimationFrame(() => fitSheetToScreen());
          }
        });
      });

      // Kontrol Lembar Denver II
      function zoomSheetBy(factor) {
        const viewport = document.getElementById('sheetViewport');
        const center = { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 };
        setSheetZoom({ scale, x: panX, y: panY }, scale * factor, center);
      }
      document.getElementById('btnZoomIn').addEventListener('click', () => zoomSheetBy(1.35));
      document.getElementById('btnZoomOut').addEventListener('click', () => zoomSheetBy(1 / 1.35));

      document.getElementById('btnFitSheet').addEventListener('click', () => {
        clearSheetHighlight();
        fitSheetToScreen();
      });
      document.getElementById('btnFocusLine').addEventListener('click', () => focusOnSheetPoint());

      document.querySelectorAll('.sector-jump-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const age = calculateAge(currentProfile);
          const item = age && getCrossingItems(age.chartAge).find(entry =>
            SECTORS.find(sector => sector.id === entry.sectorId)?.yCenterPct === Number(btn.dataset.y)
          );
          focusOnSheetPoint({ yPct: Number(btn.dataset.y), item });
        });
      });

      // Observasi pada Simulasi Grafik
      document.getElementById('btnStartObservation').addEventListener('click', openObservationForm);
      document.getElementById('btnEditObservation').addEventListener('click', openObservationForm);
      document.getElementById('btnCancelObservation').addEventListener('click', () => {
        document.getElementById('obsFormBox').classList.add('hidden');
        renderObservationSection();
      });
      document.getElementById('btnSaveObservation').addEventListener('click', () => {
        const age = calculateAge(currentProfile);
        const activeIds = new Set(age ? getCrossingItems(age.chartAge).map(item => item.id) : []);
        const answered = Array.from(document.querySelectorAll('#obsFormRows .obs-select'))
          .filter(sel => activeIds.has(sel.dataset.id) && sel.value !== 'belum-diisi');
        const error = document.getElementById('obsFormError');
        if (answered.length === 0) {
          error.textContent = 'Isi setidaknya satu respons untuk menyimpan ringkasan.';
          error.classList.remove('hidden');
          return;
        }
        error.classList.add('hidden');
        observations = Object.fromEntries(answered.map(sel => [sel.dataset.id, sel.value]));
        obsSaved = true;
        renderObservationSection();
      });

      // Rutinitas
      document.getElementById('routineForm').addEventListener('submit', event => {
        event.preventDefault();
        const time = document.getElementById('routineTimeInput').value || '08:00';
        const activity = document.getElementById('routineActivityInput');
        const text = activity.value.trim();
        if (!text) return;
        addRoutineItem(time, text);
        activity.value = '';
      });

      // Imunisasi
      document.getElementById('btnSaveVaccineRecord').addEventListener('click', () => {
        const id = document.getElementById('selectVaccineId').value;
        const date = document.getElementById('inputVaccineDate').value;
        const error = document.getElementById('vaccineFormError');
        const problem = vaccineRecordProblem(id, date, currentProfile);
        if (problem) {
          error.textContent = problem;
          error.classList.remove('hidden');
          return;
        }
        if (vaccineRecords[id] && vaccineRecords[id] !== date && !window.confirm('Ganti tanggal pemberian yang sudah tercatat?')) return;
        vaccineRecords[id] = date;
        saveVisitStore();
        clearVaccineForm();
        renderVaccines();
      });

      // Modals lainnya
      document.getElementById('btnOpenVisitPrep').addEventListener('click', () => openAppDialog(visitElement('modalVisitPrep')));
      document.querySelectorAll('.visit-check').forEach(c => c.addEventListener('change', updateVisitPrepSummary));

      document.getElementById('btnOpenStoryRoom').addEventListener('click', () => openAppDialog(visitElement('modalStoryRoom')));
      document.querySelectorAll('.story-topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const topic = STORY_TOPICS[btn.dataset.topic];
          document.querySelectorAll('.story-topic-btn').forEach(b => {
            const active = b === btn;
            b.className = `story-topic-btn min-h-11 px-2 rounded-lg border font-semibold ${active ? 'border-primary bg-soft text-primary' : 'border-divider bg-surface text-muted'}`;
          });
          document.getElementById('storyTopicHeading').textContent = topic.heading;
          document.getElementById('storyQ1').textContent = topic.q1;
          document.getElementById('storyQ2').textContent = topic.q2;
        });
      });

      function openSources() {
        document.getElementById('confirmResetBox').classList.add('hidden');
        openAppDialog(visitElement('modalAbout'));
      }
      document.getElementById('btnOpenAbout').addEventListener('click', openSources);
      document.getElementById('btnRequestResetSession').addEventListener('click', () => document.getElementById('confirmResetBox').classList.remove('hidden'));
      document.getElementById('btnCancelReset').addEventListener('click', () => document.getElementById('confirmResetBox').classList.add('hidden'));
      document.getElementById('btnConfirmReset').addEventListener('click', () => {
        visitStore = { version: 1, selected: null, children: [], visits: [] };
        document.querySelectorAll('.visit-check').forEach(c => { c.checked = false; });
        document.getElementById('confirmResetBox').classList.add('hidden');
        visitElement('modalAbout').close();
        activateVisit(null);
        switchTab('beranda');
      });

      visitElement('btnImportVisits').addEventListener('click', importVisitHistory);
      loadVisitStore();
    });
  
    window.bukuSakuBack = function () {
      const dialog = document.querySelector('dialog[open]');
      if (dialog) {
        dialog.close();
        return true;
      }
      if (guideContext && !visitElement('tab-panduan').classList.contains('hidden')) {
        returnFromGuide();
        return true;
      }
      if (visitElement('tab-beranda').classList.contains('hidden')) {
        switchTab('beranda');
        return true;
      }
      return false;
    };
