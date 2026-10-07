import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const Category = db.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false // <-- Tambahkan ini agar Sequelize tidak mencari createdAt & updatedAt
});

// Relasi Self-Association untuk kategori bertingkat
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

export default Category;