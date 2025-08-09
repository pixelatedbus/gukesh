# AI Magnus vs Gukesh: King and Pawn Endgame Solver

Proyek ini adalah implementasi dari *solver* catur untuk skenario *endgame* "King and Pawn vs King". Aplikasi ini berbasis web dengan backend Python (FastAPI) yang menjalankan AI dan frontend (Next.js) sebagai antarmuka pengguna. AI "Magnus" (putih) menggunakan algoritma **Minimax dengan Alpha-Beta Pruning** untuk menentukan langkah terbaik dan menjamin kemenangan.

![gukesh](/webpage.png)

## Fitur yang Diimplementasikan

Berikut adalah daftar fitur yang telah diimplementasikan sesuai dengan spesifikasi yang diberikan.

### Spesifikasi Wajib

| No. | Item | Status | Catatan |
| :-- | :--- | :--- | :--- |
| 1 | **Algoritma Minimax** | ✅ | Menggunakan Minimax dengan optimisasi Alpha-Beta Pruning. |
| 2 | **Input Papan (.txt)** | ✅ | Pengguna dapat mengunggah file `.txt` untuk mengatur posisi awal. |
| 3 | **Play as Gukesh** | ✅ | Raja hitam dapat digerakkan secara interaktif oleh pengguna. |
| 4 | **Display Papan Catur** | ✅ | Tampilan papan 8x8 lengkap dengan *files* dan *ranks*. |
| 5 | **Info Analisis** | ✅ | Menampilkan analisis AI. |
| 6 | **Validasi Input/Moves** | ✅ | Sistem hanya memperbolehkan langkah yang legal sesuai aturan catur. |

### Spesifikasi Bonus

| No. | Item | Status | Catatan |
| :-- | :--- | :--- | :--- |
| 1 | **Playback Control** | ✅ | Fitur untuk melihat riwayat permainan (mundur/maju). |
| 2 | **Deployment** | ✅ | Aplikasi berhasil di-deploy dan dapat diakses secara publik. |
| 3 | **Mate in X**  | ✅ | Aplikasi dapat memprediksi *mate* jika ditemukan. |

## Arsitektur & Teknologi

Aplikasi ini dibangun dengan arsitektur modern yang memisahkan antara backend dan frontend.

* **Backend**: **Python** dengan framework **FastAPI**. Bertugas untuk mengelola logika permainan, validasi langkah, dan menjalankan algoritma AI.
* **Frontend**: **Next.js** (React) dengan **TypeScript** dan **Tailwind CSS**. Bertugas untuk menampilkan antarmuka pengguna yang interaktif dan responsif.
* **Deployment**:
    * Frontend di-deploy di **Vercel**.
    * Backend di-deploy di **Railway**.

## Penjelasan Algoritma

Inti dari AI Magnus adalah algoritma **Minimax** yang dioptimalkan dengan **Alpha-Beta Pruning**.

### Konsep Minimax

Minimax adalah algoritma rekursif yang digunakan untuk membuat keputusan dalam permainan dua pemain dengan informasi sempurna (seperti catur). Tujuannya adalah untuk menemukan langkah optimal dengan asumsi bahwa lawan juga akan bermain secara optimal.

1.  **Maximizer (AI Magnus)**: Tujuannya adalah untuk memaksimalkan skor evaluasi papan.
2.  **Minimizer (Gukesh)**: Tujuannya adalah untuk meminimalkan skor evaluasi papan.

AI akan membangun pohon permainan hingga kedalaman (depth) tertentu. Di setiap level pohon, AI akan memilih langkah dengan skor tertinggi (untuk Maximizer) atau terendah (untuk Minimizer).

### Fungsi Evaluasi

Untuk memberikan nilai numerik pada setiap posisi papan, sebuah fungsi evaluasi statis digunakan. Fungsi ini memiliki dua skenario utama:

#### 1. Skenario KP vs K (King & Pawn vs King)

Saat pion putih belum promosi, evaluasi berfokus untuk memaksimalkan peluang promosi:

* **Pion Menuju Promosi**: Memberi bonus kuadratik berdasarkan seberapa dekat pion ke baris promosi.
* **Raja Protektif**: Memberi bonus jika raja putih berada di dekat pionnya dan mengontrol jalur promosi.
* **Menjauhkan Lawan**: Memberi bonus jika pion berhasil menjauh dari raja lawan.
* **Membatasi Lawan**: Memberi penalti berdasarkan jumlah langkah legal yang dimiliki raja lawan. Semakin sedikit langkah lawan, semakin baik.

#### 2. Skenario KQ vs K (King & Queen vs King)

Setelah pion dipromosikan menjadi Ratu, strategi berubah menjadi melakukan *checkmate*:

* **Memaksa ke Tepi**: Memberi bonus besar untuk mendorong raja lawan ke tepi atau sudut papan.
* **Serangan Terkoordinasi**: Memberi bonus jika Raja dan Ratu putih bekerja sama untuk mendekati raja lawan.
* **Memperkecil Ruang Gerak**: Memberi bonus untuk memperkecil "kotak" imajiner di sekitar raja lawan menggunakan Ratu, yang secara efektif membatasi gerakannya.
* **Restriksi Gerakan Lawan**: Memberi penalti yang lebih besar untuk setiap langkah legal yang masih dimiliki raja lawan.

### Optimisasi Alpha-Beta Pruning

Membangun seluruh pohon permainan sangat tidak efisien. **Alpha-Beta Pruning** adalah teknik optimisasi yang secara drastis mengurangi jumlah node yang perlu dievaluasi dalam pohon pencarian Minimax.

* **Alpha**: Nilai terbaik (tertinggi) yang bisa dijamin oleh Maximizer.
* **Beta**: Nilai terbaik (terendah) yang bisa dijamin oleh Minimizer.

Pruning (pemangkasan) terjadi ketika algoritma menemukan bahwa sebuah cabang pencarian tidak akan mungkin menghasilkan skor yang lebih baik dari yang sudah ditemukan sebelumnya. Jika `beta <= alpha`, maka cabang tersebut dapat dipangkas karena tidak akan pernah dipilih.

## Detail Implementasi: Representasi State

Untuk efisiensi penyimpanan riwayat permainan pada fitur *Playback Control*, posisi papan direpresentasikan menggunakan **FEN (Forsyth-Edwards Notation)**. FEN adalah format teks standar yang ringkas untuk mendeskripsikan state papan catur, sehingga lebih hemat memori dibandingkan menyimpan seluruh struktur data papan di setiap langkah.

## Cara Menjalankan Proyek Secara Lokal

### Requirements

* Python 3.8+
* Node.js 18+
* Git

### Backend Setup (FastAPI)

```bash
# 1. Masuk ke direktori backend
cd src/backend

# 2. Buat dan aktifkan virtual environment
python -m venv venv
# Untuk Windows
.\venv\Scripts\Activate.ps1
# Untuk macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan server
# Perhatikan path 'app.main:app' karena main.py ada di dalam folder app
uvicorn app.main:app --reload
```

Server backend akan berjalan di `http://127.0.0.1:8000`.

### Frontend Setup (Next.js)

```bash
# 1. Buka terminal baru dan masuk ke direktori frontend
cd src/frontend

# 2. Install dependencies
npm install

# 3. Jalankan server development
npm run dev
```

Aplikasi frontend akan dapat diakses di `http://localhost:3000`.

## Deployment

Aplikasi ini telah di-deploy dan dapat diakses melalui tautan berikut:

* **Frontend (Vercel)**: <https://gukesh.vercel.app/>
* **Backend (Railway)**: <https://gukesh-v-magnus.up.railway.app/>

## Identitas
- Lutfi Hakim Yusra - 13523084

