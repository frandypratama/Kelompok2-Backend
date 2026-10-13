import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unik = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unik}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const diizinkan = ["image/jpeg", "image/png", "image/webp"];
  if (diizinkan.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format foto harus JPG, PNG, atau WEBP"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadFoto = (req, res, next) => {
  upload.single("image")(req, res, (err) => { // Sesuaikan nama field form menjadi "image" sesuai database products Anda
    if (err) {
      const message = err.code === "LIMIT_FILE_SIZE" ? "Ukuran foto maksimal 2 MB" : err.message;
      return res.status(400).json({ message });
    }
    next();
  });
};