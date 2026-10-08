import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    // ==========================================
    // CEK REQUEST
    // ==========================================

    console.log("\n=================================");
    console.log("LOGIN REQUEST");
    console.log("BODY:", req.body);
    console.log("=================================");

    // ==========================================
    // AMBIL DATA LOGIN
    // ==========================================

    const { username, password } = req.body || {};

    console.log("Username:", username);

    // ==========================================
    // VALIDASI INPUT
    // ==========================================

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    // ==========================================
    // CEK SEMUA USER
    // DEBUG SEMENTARA
    // ==========================================

    const semuaUser = await User.findAll({
      attributes: ["id", "name", "username", "role"],
    });

    console.log(
      "USER YANG TERBACA BACKEND:",
      semuaUser.map((u) => u.toJSON())
    );

    // ==========================================
    // CARI USER BERDASARKAN USERNAME
    // ==========================================

    const user = await User.findOne({
      where: {
        username: username.trim(),
      },
    });

    console.log(
      "USER DATABASE:",
      user?.toJSON()
    );

    // ==========================================
    // USER TIDAK DITEMUKAN
    // ==========================================

    if (!user) {
      console.log("USER TIDAK DITEMUKAN");

      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    // ==========================================
    // CEK PASSWORD
    // ==========================================

    if (user.password !== password) {
      console.log("PASSWORD SALAH");

      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    console.log("PASSWORD BENAR");

    // ==========================================
    // CEK ROLE DATABASE
    // ==========================================

    const databaseRole = String(user.role)
      .trim()
      .toLowerCase();

    console.log(
      "ROLE DATABASE:",
      databaseRole
    );

    // ==========================================
    // TENTUKAN ROLE FRONTEND
    // ==========================================

    let frontendRole = null;

    // OWNER / ADMIN
    if (
      databaseRole === "owner" ||
      databaseRole === "admin"
    ) {
      frontendRole = "admin";
    }

    // USER
    if (databaseRole === "user") {
      frontendRole = "karyawan";
    }

    console.log(
      "ROLE FRONTEND:",
      frontendRole
    );

    // ==========================================
    // ROLE TIDAK DIKENALI
    // ==========================================

    if (!frontendRole) {
      console.log(
        "ROLE TIDAK DIKENALI:",
        databaseRole
      );

      return res.status(403).json({
        message: `Role "${databaseRole}" tidak dikenali`,
      });
    }

    // ==========================================
    // CEK JWT SECRET
    // ==========================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET TIDAK DITEMUKAN DI .env"
      );

      return res.status(500).json({
        message:
          "Konfigurasi JWT_SECRET belum tersedia di server",
      });
    }

    // ==========================================
    // BUAT JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        role: databaseRole,
        frontendRole: frontendRole,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log(
      "JWT BERHASIL DIBUAT"
    );

    // ==========================================
    // DATA USER UNTUK FRONTEND
    // ==========================================

    const userData = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: databaseRole,
      frontendRole: frontendRole,
    };

    console.log(
      "USER RESPONSE:",
      userData
    );

    // ==========================================
    // RESPONSE LOGIN BERHASIL
    // ==========================================

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: userData,
    });

  } catch (error) {
    // ==========================================
    // ERROR SERVER
    // ==========================================

    console.error(
      "\n================================="
    );

    console.error(
      "LOGIN ERROR"
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "NAME:",
      error.name
    );

    console.error(
      "STACK:"
    );

    console.error(
      error.stack
    );

    console.error(
      "=================================\n"
    );

    return res.status(500).json({
      message:
        "Terjadi kesalahan pada server",
    });
  }
};