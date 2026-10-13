import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const PengeluaranCategory = db.define(
  "pengeluaran_categories",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_kategori: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Nama kategori wajib diisi",
        },
      },
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default PengeluaranCategory;