import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Category from "./CategoryModel.js";

const { DataTypes } = Sequelize;

const Product = db.define('produk', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    nama_produk: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    harga_beli: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    harga_jual: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    kategori_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Category.hasMany(Product, { foreignKey: çategory_id })

export default Product;

// // Auto-sync database jika tabel belum ada (opsional)
// (async () => {
//     await db.sync();
// })();