import { Sequelize } from "sequelize";
import db from "../config/Database";

const Category = db.define('kategori', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_kategori: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'kategori',
            key: 'id'
        }
    }
}, {
    freezeTableName: true // Mencegah Sequelize mengubah nama tabel menjadi plural (kategoris)
});

// Definisikan relasi hierarki (Self-Association)
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

export default Category;