import multer from "multer";
import path from "path";

// Konfigurasi Penyimpanan File
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pastikan folder 'uploads' sudah dibuat di root folder backend
  },
  filename: (req, file, cb) => {
    // Membuat nama file unik menggunakan timestamp + angka random agar tidak bentrok
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter jenis file (hanya mengizinkan format gambar tertentu)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file gambar dengan format JPG, JPEG, PNG, atau WEBP yang diizinkan!"));
  }
};

// Inisialisasi Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file maksimal 2MB
  fileFilter: fileFilter,
});

export default upload;