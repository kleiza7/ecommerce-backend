import { Brand } from "./Brand.model";
import { Cart } from "./Cart.model";
import { CartItem } from "./CartItem.model";
import { Category } from "./Category.model";
import { Product } from "./Product.model";
import { User } from "./User.model";

export const associateModels = () => {
  Brand.hasMany(Product, {
    foreignKey: "brand_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Product.belongsTo(Brand, {
    foreignKey: "brand_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Category.hasMany(Product, {
    foreignKey: "category_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Product.belongsTo(Category, {
    foreignKey: "category_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Category.hasMany(Category, {
    as: "children",
    foreignKey: "parent_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Category.belongsTo(Category, {
    as: "parent",
    foreignKey: "parent_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  User.hasOne(Cart, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Cart.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Cart.hasMany(CartItem, {
    foreignKey: "cart_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  CartItem.belongsTo(Cart, {
    foreignKey: "cart_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Product.hasMany(CartItem, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  CartItem.belongsTo(Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
