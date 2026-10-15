# Portfolio Interaktif — "Kota Neon"

- **Tanggal:** 2026-10-15
- **Status:** Draf, menunggu review
- **Production:** https://miftahulhuda.vercel.app
- **Prototipe acuan:** https://claude.ai/artifact/F1zhbMxZQGVbDbhhC54WMP (v3)
- **Dibangun di atas:** desain D "Command Center" (`docs/superpowers/specs/2026-10-12-portfolio-redesign-design.md`, branch `feat/redesign-d`), yang menjadi **versi ringkas**

## 1. Tujuan

Halaman utama berubah menjadi pengalaman interaktif seperti game. Pengunjung mengendarai sepeda menjelajahi kota malam bernuansa neon. Kota punya enam gerbang yang masing-masing membuka satu bagian informasi, serta billboard berisi informasi tentang Miftahul. Bagi pengunjung yang ingin cepat (perekrut, mesin pencari, HP lemah), desain D tetap tersedia sebagai **versi ringkas**.

**Yang diminta pengguna (dari percakapan)**
- Konsep seperti portfolio Bruno Simon, tetapi kendaraannya **sepeda**.
- Suasananya **kota malam neon**.
- Pengunjung bisa **jalan bebas** dan berbelok kiri-kanan. Semua jalan **tersambung, tanpa jalan buntu**.
- Gerakan **halus, tidak kaku**.
- Suasana **ramai**: lalu lintas, pejalan kaki, lampu, taman.
- **Billboard di banyak tempat** dengan **desain yang berbeda-beda**, bagus dan rapi, berisi info tentang Miftahul dan hal menarik lain.
- **Bahasa profesional** di semua informasi.
- Info gerbang **muncul lagi** setiap kali gerbang dilewati ulang.
- Hero versi ringkas: kubus bertulisan nama teknologi diganti **ikon 3D melayang** yang bisa berinteraksi dengan pengguna.

**Asumsi yang disetujui:** versi ringkas (desain D) tetap ada untuk perekrut, SEO, dan perangkat lemah.

**Kriteria sukses**
- Rasa dan tampilan setara atau lebih baik daripada prototipe v3 di desktop (≥1280px). Bisa dimainkan di HP (≤390px) dengan kontrol sentuh.
- Desktop kelas menengah: **≥ 55 fps** pada tier tinggi. HP kelas menengah: **≥ 30 fps** pada tier rendah.
- Halaman `/` (layar intro) dirender server dan berisi konten nyata. **LCP ≤ 2,5 detik** (Lighthouse mobile). Kode 3D tidak masuk bundle awal.
- Versi ringkas `/ringkas` mempertahankan target D: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.
- Bilingual EN/ID untuk semua teks baru: gerbang, billboard, HUD, intro.
- Semua isi gerbang dan billboard diambil dari `src/content/*`. **Tidak ada fakta yang dikarang.**
- `npm run lint`, `npm run test`, `npm run build`, dan `npm run test:e2e` hijau.

**Di luar scope:** multiplayer, fisika rigid-body penuh (Rapier/Cannon), model 3D eksternal (glTF), gamepad, musik latar, simpan progres di server, editor peta.

## 2. Keputusan teknis

| Area | Keputusan | Alasan |
|---|---|---|
| Rendering 3D | **@react-three/fiber 9 + drei 10 + three 0.180** (sudah terpasang) | Sudah dipakai di D |
| Post-processing | **@react-three/postprocessing** (Bloom), hanya di tier tinggi | Glow neon adalah inti tampilan; tier rendah tanpa bloom |
| Fisika | **Kinematika buatan sendiri** (seperti prototipe): sepeda, tabrakan AABB/lingkaran, mobil di jalur graf | Ringan, deterministik, mudah dites; tidak perlu engine fisika |
| Geometri | Semua prosedural: box, cylinder, torus. **InstancedMesh** untuk gedung, lampu, marka, dan kerucut | Tanpa aset yang harus diunduh; draw call rendah |
| Tekstur | Canvas 2D: jendela gedung, papan atap, billboard, papan gerbang. Dibuat setelah `document.fonts.ready` | Teks tajam memakai font situs; bisa bilingual |
| Loop | Satu `useFrame` per sistem (sepeda, lalu lintas, pejalan kaki, gerbang, kamera). State yang berubah tiap frame disimpan di **ref/objek mutable, bukan React state** | Menghindari re-render 60×/detik |
| State UI | Store kecil berbasis `useSyncExternalStore` (pola yang sama dengan D) untuk gerbang yang dikunjungi, kartu terbuka, target navigasi, dan suara | HUD (DOM) dan dunia (R3F) berbagi state tanpa library baru |
| Tier performa | `PerformanceMonitor` (drei) + deteksi `pointer: coarse`. **Tinggi:** bloom, DPR ≤ 2, 18 mobil, 44 pejalan kaki. **Rendah:** tanpa bloom, DPR ≤ 1,25, 8 mobil, 16 pejalan kaki, fog lebih rapat | Turun otomatis bila fps rendah |
| Lazy load | Dunia di-load `next/dynamic` (`ssr:false`) saat tombol "Mulai menjelajah" diklik. Preload saat browser idle di desktop | Intro cepat; chunk 3D tidak memblokir LCP |
| Audio | Web Audio API (bel, ting gerbang, klakson, benturan) dengan nada sintetis, tanpa file. Mulai setelah klik "Mulai". Tombol mute di HUD, pilihan disimpan di `localStorage` | Tidak ada file audio; aman untuk autoplay policy |
| Routing | `/` = intro + dunia. `/ringkas` = desain D (dipindah dari `/`). `/projects/[slug]` tetap | Pengalaman utama di depan, versi ringkas tetap terindeks |

## 3. Pengalaman pengguna

### 3.1 Layar intro (`/`, dirender server)
- Isi: label "Portofolio interaktif", judul "Jelajahi portofolio **Miftahul Huda**", satu paragraf ringkasan, tombol **Mulai menjelajah →** dan **Lihat versi ringkas ↗** (ke `/ringkas`), daftar kontrol, serta toggle bahasa EN·ID.
- Latar: gambar statis kota neon (WebP hasil render prototipe, `priority`, ≤ 120 KB) sehingga LCP berupa gambar ringan.
- Menuju versi ringkas lebih ditonjolkan bila:
  - WebGL tidak tersedia: tombol Mulai diganti pesan "Perangkat ini tidak mendukung 3D" dan tombol versi ringkas.
  - Pengguna memakai `prefers-reduced-motion`: versi ringkas menjadi tombol utama, Mulai tetap ada.
- Metadata, JSON-LD Person, dan Open Graph tetap ada di `/`.

### 3.2 Dunia
- **Tata kota:** grid 5×5 persimpangan berjarak 70 unit, lebar jalan 12, trotoar 3,2. Jalan tepi membentuk jalan lingkar, jadi tidak ada jalan buntu.
  - 15 blok berisi gedung dengan jendela menyala, garis neon atap dan lantai dasar, serta papan nama di atap. Papan atap memakai nama tempat umum, bukan klaim.
  - 1 blok taman dengan air mancur dan pohon berlampu.
  - Gedung latar di luar batas kota, zebra cross di setiap persimpangan, dan lampu jalan di sudut serta tengah blok.
- **Sepeda dan pengendara:** model prosedural seperti di prototipe.
  - Kaki dianimasikan dengan IK sederhana.
  - Setang ikut berbelok, sepeda miring di tikungan, dan pengendara condong ke depan saat ngebut.
  - Lampu depan berupa SpotLight, lampu belakang menyala.
- **Kontrol:**
  - Keyboard: W/↑ gowes, S/↓ rem dan mundur, A/D atau ←/→ belok, Shift ngebut, Spasi bel, Esc menutup kartu.
  - Sentuh: tombol ◀ ▶ di kiri; 🔔, REM, GAS di kanan.
- **Rasa gerak:**
  - Akselerasi dengan drag, belok dengan input yang dihaluskan (smoothing ≈ 7/detik).
  - Laju belok bergantung pada kecepatan, sehingga tidak bisa berputar di tempat.
  - Kamera mengikuti seperti pegas, dengan target pandang di depan sepeda. FOV melebar sesuai kecepatan, dan layar sedikit bergetar saat benturan.
- **Tabrakan:**
  - Gedung memakai kotak (AABB). Tiang, pohon, air mancur, dan pilar gerbang memakai lingkaran.
  - Sepeda didorong keluar dan kecepatannya berkurang. Ada batas tepi kota.
- **Lalu lintas:**
  - Mobil bergerak di graf jalan dengan **lajur kiri** (seperti di Indonesia).
  - Belokan di persimpangan memakai kurva bezier kuadrat, dan arah berikutnya acak tanpa putar balik.
  - Mobil berhenti bila sepeda atau mobil lain ada di depannya. Ada jalan keluar dari deadlock: setelah 3 detik menunggu, mobil mengabaikan mobil lain selama 1,5 detik.
  - Mobil mengklakson bila terhalang lebih dari 1,2 detik. Bertabrakan dengan mobil mendorong sepeda dan memperlambatnya.
- **Pejalan kaki:** berjalan memutari trotoar blok, berhenti bila sepeda terlalu dekat, dan muncul notifikasi "Utamakan pejalan kaki".
- **Gerbang (6):**
  - Tiap gerbang punya pilar neon, papan "01 · PROFIL", cincin berputar, dan pilar cahaya setinggi langit.
  - Lokasi: Profil (140,175), Keahlian (175,210), Pengalaman (280,105), Proyek (105,0), Pendidikan (0,175), Kontak (175,280). Boleh dikunjungi dalam urutan apa pun.
  - Melewati gerbang membuka kartu info **setiap kali**. Kunjungan pertama juga menandai gerbang selesai: warnanya berubah lime, bunyi ting, dan bar rute ditandai.
- **Navigasi:**
  - Bar rute berisi 6 titik. Titik yang sudah dikunjungi bisa diklik untuk membuka kartunya.
  - Pil "→ {gerbang terdekat yang belum dikunjungi} · {jarak} m".
  - Panah hijau melayang di atas pengendara.
  - Minimap memuat jalan, taman, mobil, gerbang, billboard, dan arah sepeda.
- **Kartu info:** panel kanan di desktop, bawah di HP. `role="dialog"` non-modal dengan `aria-live="polite"`, tombol tutup, dan bisa ditutup dengan Esc. Sepeda tetap bisa dikendarai saat kartu terbuka.
- **Selesai:** setelah keenam gerbang dikunjungi muncul dialog "Penjelajahan selesai" dengan email, serta tombol **Ulangi dari awal** dan **Lanjut menjelajah**.
- **HUD permanen:** speedometer (km/j), tombol mute, toggle bahasa, dan tautan "Versi ringkas".

### 3.3 Isi gerbang (diambil dari `src/content`)

| Gerbang | Isi |
|---|---|
| Profil | nama, headline, `summary`, lokasi, chip "Tersedia untuk peluang baru" |
| Keahlian | `skills[]` per grup (Front-End, Back-End, Database, Tools & Others) |
| Pengalaman | `experience[]`: posisi, perusahaan, periode, satu kalimat dari `achievements[0]` |
| Proyek | `projects[]`: judul, teknologi, `description`, tautan ke `/projects/[slug]` |
| Pendidikan | institusi, gelar, periode, IPK `gpa / gpaMax` |
| Kontak | email, GitHub, LinkedIn, tombol "Kirim pesan" ke `/ringkas#contact` |

### 3.4 Billboard (8 unit, 16 sisi, 10 desain)

Bentuk fisik:
- **Lebar:** panel 16×8 di atas tiang, menjulur di atas tepi jalan pada ketinggian ±11.
- **Tegak:** pylon 7×10,5 di trotoar.

Semua billboard ditempatkan di trotoar kiri, menghadap pengendara yang datang, dan dimiringkan ke arah lajur.

| Desain | Isi (sumber konten) |
|---|---|
| `profile` | monogram MH, nama, headline, lokasi, chip status |
| `values` | Aman · Cepat · Andal, masing-masing dengan keterangan singkat (teks UI) |
| `stack` | grid 8 teknologi (`skills`) |
| `terminal` | `whoami`, `role`, `ls stack/`, `status`; data dari `personal` + `skills` |
| `stat` | IPK besar, gelar, institusi, periode (`education`) |
| `contact` | email, GitHub, LinkedIn (`personal`) |
| `timeline` | titik waktu dari `experience` + kelulusan dari `education`, diurutkan berdasarkan tahun |
| `process` | 4 langkah (`process`) |
| `browser` | proyek unggulan: judul, URL GitHub, deskripsi, tag (`projects`) |
| `projects` | jumlah dan daftar judul proyek (`projects`) |

Penempatan dan pasangan sisi depan/belakang mengikuti prototipe v3. Kalau suatu desain tidak punya data (misalnya proyek tanpa GitHub), desain itu diganti `profile` atau `values`. Billboard tidak pernah menampilkan placeholder.

### 3.5 Versi ringkas `/ringkas` (desain D)
- Seluruh isi halaman D saat ini dipindah ke `/ringkas`. Tautan internal `/#work` dan sejenisnya diperbarui menjadi `/ringkas#…`. Command palette mendapat aksi baru "Jelajahi kota 3D".
- **Kartu hero 3D:** `StackCubeCard` (kubus bertulisan teknologi) diganti **`FloatingIconsCard`**:
  - 6–7 ikon simbol developer hasil extrude SVG: `</>`, `{ }`, `$_`, git-branch, database, ⚡, gear. Warna lime dan ink.
  - Ikon melayang dengan ritme berbeda-beda, bergeser paralaks mengikuti kursor, dan menghindar bila kursor mendekat.
  - Hover: ikon membesar dan menyala. Klik: berputar lalu memantul. Drag: ikon bisa dilempar lalu kembali seperti pegas.
  - Fallback CSS (ikon datar melayang dan paralaks) untuk HP, saat WebGL tidak ada, saat WebGL gagal atau context hilang (memakai pola `CubeErrorBoundary` yang sudah ada), dan saat kanvas belum dimuat.
  - Reduced-motion: ikon diam. Ikon bersifat dekoratif (`aria-hidden`).

## 4. Arsitektur dan file

Logika dunia berupa **modul TypeScript murni** tanpa React dan three, sehingga bisa dites dengan Vitest di Node. Komponen R3F hanya membaca logika itu dan menggambarnya.

```
src/world/                     # logika murni, dites unit
  city.ts        # konstanta grid, blok, segmen jalan, collider, posisi lampu/pohon
  graph.ts       # node/tetangga, segmen lajur kiri, kurva belok bezier
  bike.ts        # stepBike(state, input, dt) → state; kurva akselerasi/belok/lean
  collision.ts   # resolveCollisions(pos, rects, circles, bounds) → {pos, hit}
  traffic.ts     # stepCar(car, ctx, dt); deteksi halangan & deadlock
  pedestrians.ts # titik di keliling trotoar, jeda saat dekat sepeda
  gates.ts       # definisi gerbang, crossing test (along/across), nearest-unvisited
  billboards.ts  # penempatan + pemilihan desain dari konten (fallback bila data kosong)
  minimap.ts     # proyeksi dunia → kanvas minimap
  store.ts       # store useSyncExternalStore: visited, openCard, muted, tier
src/components/world/          # R3F (client-only)
  WorldCanvas.tsx  # <Canvas>, tier, PerformanceMonitor, Bloom, fog, lights
  City.tsx  Roads.tsx  Park.tsx  Lamps.tsx  Skyline.tsx
  Bike.tsx  CameraRig.tsx  Traffic.tsx  Pedestrians.tsx
  Gates.tsx  Billboards.tsx  GuideArrow.tsx
  painters/      # canvas 2D: windows.ts, roofSign.ts, gateSign.ts, billboard/*.ts (10 desain)
  audio.ts       # nada Web Audio
src/components/hud/            # DOM, aksesibel
  Intro.tsx  RouteBar.tsx  NavPill.tsx  Minimap.tsx  InfoCard.tsx
  TouchControls.tsx  Speedo.tsx  FinishDialog.tsx  Toast.tsx  HudControls.tsx (mute, bahasa, ringkas)
  gate-content.tsx  # isi kartu per gerbang dari content
src/components/bento/FloatingIconsCard.tsx, src/components/three/FloatingIcons.tsx, FloatingIconsCss.tsx
src/app/(portfolio)/page.tsx          # intro + <World> (dynamic)
src/app/(portfolio)/ringkas/page.tsx  # halaman D (dipindah)
src/content/ui.ts                     # string baru EN/ID: world.*, hud.*, gates.*, billboards.*
```

**Aliran data.**
- `useFrame` pada `Bike` membaca input (ref keyboard/sentuh), memanggil `stepBike` lalu `resolveCollisions`, dan menulis ke objek `bikeState` bersama.
- `Traffic`, `Pedestrians`, `Gates`, dan `CameraRig` membaca `bikeState` dalam frame yang sama.
- `Gates` memanggil `store.enterGate(i)` saat crossing terdeteksi.
- HUD berlangganan ke `store`. Minimap menggambar ulang 15×/detik dari `bikeState` dan posisi mobil.

**Penanganan error.**
- Pembuatan WebGL atau renderer gagal, atau context hilang: tampil layar "Mode 3D berhenti" dengan tombol **Muat ulang** dan **Versi ringkas** (memakai pola ErrorBoundary + `webglcontextlost` dari D).
- Chunk dunia gagal dimuat (offline, deploy baru): tombol Mulai menampilkan error dan tetap bisa dicoba lagi.
- AudioContext ditolak: dunia jalan tanpa suara.
- `localStorage` tidak bisa diakses: pengaturan hanya disimpan di memori.

## 5. Aksesibilitas
- Semua informasi gerbang dan billboard juga tersedia di `/ringkas`, dan tautannya ada di intro serta HUD.
- Kanvas diberi `aria-label` deskriptif. Seluruh HUD bisa diakses keyboard dengan fokus terlihat. Kartu info memakai heading yang benar.
- Reduced-motion: intro menyarankan versi ringkas. Di dunia, kamera intro tidak berputar, cincin dan papan tidak berkedip, dan getaran layar dimatikan.
- Kontras teks HUD ≥ 4,5:1 di atas panel.

## 6. Testing
- **Unit (Vitest, Node)** untuk setiap modul di `src/world/`:
  - Graf tanpa jalan buntu: setiap node punya ≥ 2 tetangga.
  - Kurva belok kontinu di ujung segmen.
  - `stepBike`: akselerasi menuju batas, rem, belok bergantung kecepatan, mundur membalik setir.
  - `resolveCollisions`: keluar dari kotak lewat sisi terdekat, lingkaran, dan batas.
  - Crossing gerbang dari dua arah membuka kartu setiap kali, dan "visited" hanya sekali.
  - Deadlock lalu lintas terselesaikan dalam ≤ 5 detik simulasi.
  - Billboard: data kosong memicu desain fallback.
  - Proyeksi minimap terhadap titik sudut.
- **Komponen (Testing Library):**
  - Intro: dua tombol, versi tanpa WebGL, versi reduced-motion.
  - RouteBar: titik terkunci sebelum dikunjungi dan bisa diklik sesudahnya.
  - InfoCard: Esc menutup, isi diambil dari content.
  - Parity string UI EN/ID (test yang sudah ada diperluas).
  - FloatingIconsCard memakai fallback saat WebGL gagal.
- **E2E (Playwright):**
  - `/` merender intro dari server.
  - Klik Mulai memuat kanvas.
  - Hook uji `window.__world.tp(x, z, heading)` hanya aktif bila `NEXT_PUBLIC_E2E=1`. Dengan hook ini, tes memindahkan sepeda ke depan gerbang 1, menekan W, memastikan kartu Profil terbuka, mengulanginya, dan memastikan kartu terbuka lagi.
  - Tautan versi ringkas menuju `/ringkas`, dan 10 smoke test D lama dipindah ke `/ringkas`.
- **Manual/visual:** screenshot desktop dan HP dari setiap billboard dan gerbang. Pengukuran fps dengan `PerformanceMonitor`.

## 7. Urutan kerja (gambaran untuk plan)
1. Pindahkan D ke `/ringkas` dan perbarui tautan.
2. Buat `FloatingIconsCard`.
3. Modul logika `src/world/` beserta unit test.
4. Kota statis (jalan, blok, gedung, taman, lampu).
5. Sepeda dan kamera.
6. Gerbang, store, dan HUD.
7. Lalu lintas dan pejalan kaki.
8. Billboard (10 desain).
9. Intro, lazy load, tier performa, dan bloom.
10. Audio, i18n, dan aksesibilitas.
11. E2E, Lighthouse, dan review akhir.

Pekerjaan dilakukan di branch baru `feat/kota-neon` yang dibuat dari `feat/redesign-d`. Tidak ada push tanpa izin.
