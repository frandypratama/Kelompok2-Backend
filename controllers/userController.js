import User from "../models/User.js";

// ==========================================
// GET SEMUA USER
// ==========================================
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      message: "Data user berhasil diambil",
      data: users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
};


// ==========================================
// GET USER BERDASARKAN ID
// ==========================================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data user berhasil diambil",
      data: user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    res.status(500).json({
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
};


// ==========================================
// TAMBAH USER
// ==========================================
export const createUser = async (req, res) => {
  try {
    const {
      nama,
      username,
      password,
      role,
    } = req.body;

    // Validasi
    if (!nama || !username || !password || !role) {
      return res.status(400).json({
        message:
          "Nama, username, password, dan role wajib diisi",
      });
    }

    // Cek username
    const existingUser = await User.findOne({
      where: {
        username: username.trim(),
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username sudah digunakan",
      });
    }

    const user = await User.create({
      nama: nama.trim(),
      username: username.trim(),
      password,
      role: role.trim().toLowerCase(),
    });

    res.status(201).json({
      message: "User berhasil ditambahkan",
      data: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    res.status(500).json({
      message: "Gagal menambahkan user",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE USER
// ==========================================
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nama,
      username,
      password,
      role,
    } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // ======================================
    // CEK USERNAME
    // ======================================
    if (
      username &&
      username.trim() !== user.username
    ) {
      const existingUser = await User.findOne({
        where: {
          username: username.trim(),
        },
      });

      if (
        existingUser &&
        existingUser.id !== user.id
      ) {
        return res.status(400).json({
          message: "Username sudah digunakan",
        });
      }

      user.username = username.trim();
    }

    // ======================================
    // UPDATE NAMA
    // ======================================
    if (nama) {
      user.nama = nama.trim();
    }

    // ======================================
    // UPDATE PASSWORD
    // ======================================
    if (password) {
      user.password = password;
    }

    // ======================================
    // UPDATE ROLE
    // ======================================
    if (role) {
      user.role = role.trim().toLowerCase();
    }

    await user.save();

    res.status(200).json({
      message: "User berhasil diperbarui",
      data: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    res.status(500).json({
      message: "Gagal memperbarui user",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE USER
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Tidak boleh menghapus akun sendiri
    if (
      req.user &&
      Number(req.user.id) === Number(id)
    ) {
      return res.status(400).json({
        message: "Anda tidak dapat menghapus akun sendiri",
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      message: "Gagal menghapus user",
      error: error.message,
    });
  }
};
