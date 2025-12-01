import { Brand } from "./Brand.model";
import { Category } from "./Category.model";
import { Product } from "./Product.model";

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
    onDelete: "SET NULL", // 🔥 Daha doğru davranış
    onUpdate: "CASCADE",
  });

  Product.belongsTo(Category, {
    foreignKey: "category_id",
    onDelete: "SET NULL", // Ürünü silmek gereksiz olur
    onUpdate: "CASCADE",
  });

  Category.hasMany(Category, {
    as: "children",
    foreignKey: "parent_id",
    onDelete: "SET NULL", // 🔥 En doğru davranış
    onUpdate: "CASCADE",
  });

  Category.belongsTo(Category, {
    as: "parent",
    foreignKey: "parent_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
};
