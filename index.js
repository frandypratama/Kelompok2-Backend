import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/database.js";
import "./models/User.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API POSify aktif",
  });
});

app.use("/api/auth", authRoute);

try {
  await db.authenticate();

  console.log("Database berhasil terhubung");

  await db.sync();

  console.log("Database berhasil disinkronkan");

  app.listen(PORT, () => {
    console.log(
      `Server POSify berjalan di http://localhost:${PORT}`
    );
  });
} catch (error) {
  console.error("Gagal menjalankan server:", error);
}