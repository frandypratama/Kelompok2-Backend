//Kelompok2-Backend\models\PengeluaranModel.js
import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import PengeluaranCategory from "./PengeluaranCategoryModel.js";

const Pengeluaran = db.define(
  "pengeluaran",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pengeluaran_categories",
        key: "id",
      },
    },
    nominal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    metode_pembayaran: {
      type: DataTypes.ENUM("tunai", "transfer", "qris"),
      allowNull: false,
      defaultValue: "tunai",
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Relasi kategori dengan transaksi pengeluaran
Pengeluaran.belongsTo(PengeluaranCategory, {
  foreignKey: "kategori_id",
  as: "kategori",
});

PengeluaranCategory.hasMany(Pengeluaran, {
  foreignKey: "kategori_id",
  as: "pengeluaran",
});

export default Pengeluaran;