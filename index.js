import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import CategoryRoute from "./routes/CategoryRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import db from "./config/Database.js";
import "./models/User.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.json({
    message: "API POSify aktif",
  });
});

// ROUTES
// ROUTES
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use('/api/categories', CategoryRoute); // Ubah dari 'category' menjadi 'categories'
app.use('/api/products', ProductRoute);   // Ubah dari 'product' menjadi 'products'
// DATABASE
try {
  await db.authenticate();

  console.log("Database berhasil terhubung");

  await db.sync();

  console.log("Database berhasil disinkronkan");

  // SERVER
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
