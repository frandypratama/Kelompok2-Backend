import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/database.js";

// Model
import "./models/User.js";

// Routes
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// CORS
// ==========================================
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// ==========================================
// JSON
// ==========================================
app.use(express.json());

// ==========================================
// TEST API
// ==========================================
app.get("/", (req, res) => {
  res.json({
    message: "API POSify aktif",
  });
});

// ==========================================
// AUTH
// ==========================================
app.use("/api/auth", authRoute);

// ==========================================
// USER CRUD
// ==========================================
app.use("/api/users", userRoute);

// ==========================================
// DATABASE
// ==========================================
try {
  await db.authenticate();

  console.log("Database berhasil terhubung");

  await db.sync();

  console.log("Database berhasil disinkronkan");

  // ========================================
  // SERVER
  // ========================================
  app.listen(PORT, () => {
    console.log(
      `Server POSify berjalan di http://localhost:${PORT}`
    );
  });
} catch (error) {
  console.error(
    "Gagal menjalankan server:",
    error
  );
}

