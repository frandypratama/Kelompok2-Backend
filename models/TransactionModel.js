import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import Product from "./ProductModel.js";

export const Transaction = db.define('transactions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paid_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true
});

export const TransactionDetail = db.define('transaction_details', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    selling_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Relasi antar tabel
Transaction.hasMany(TransactionDetail, { foreignKey: 'transaction_id', as: 'details' });
TransactionDetail.belongsTo(Transaction, { foreignKey: 'transaction_id' });

TransactionDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });