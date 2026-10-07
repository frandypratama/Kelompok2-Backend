import express from "express";
import cors from "cors";
import db from "./config/Database.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import ProductRoute from "./routes/ProductRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// Daftarkan Prefix Route API
app.use('/api', CategoryRoute);
app.use('/api', ProductRoute);

const PORT = process.env.PORT || 3000;

db.authenticate()
    .then(() => {
        console.log('Database MySQL Berhasil Terhubung.');
        app.listen(PORT, () => {
            console.log(`Server berjalan di port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Gagal terhubung ke database:', err);
    });