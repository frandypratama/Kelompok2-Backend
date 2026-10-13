//index.js
import User from "./User.js";
import Category from "./CategoryModel.js";
import Product from "./ProductModel.js";
import Transaction from "./TransactionModel.js";
import TransactionItem from "./TransactionItemModel.js";

Category.hasMany(Product, {
  foreignKey: "category_id",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

User.hasMany(Transaction, {
  foreignKey: "user_id",
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
});

Transaction.hasMany(TransactionItem, {
  foreignKey: "transaction_id",
});

TransactionItem.belongsTo(Transaction, {
  foreignKey: "transaction_id",
});

Product.hasMany(TransactionItem, {
  foreignKey: "product_id",
});

TransactionItem.belongsTo(Product, {
  foreignKey: "product_id",
});

export {
  User,
  Category,
  Product,
  Transaction,
  TransactionItem,
};