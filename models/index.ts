import { Brand } from "./Brand.model";
import { Category } from "./Category.model";
import { Product } from "./Product.model";

export const associateModels = () => {
  Brand.hasMany(Product, { foreignKey: "brand_id", onDelete: "CASCADE" });
  Product.belongsTo(Brand, { foreignKey: "brand_id" });

  Category.hasMany(Product, { foreignKey: "category_id", onDelete: "CASCADE" });
  Product.belongsTo(Category, { foreignKey: "category_id" });

  Category.hasMany(Category, {
    as: "children",
    foreignKey: "parent_id",
    onDelete: "SET NULL",
  });

  Category.belongsTo(Category, {
    as: "parent",
    foreignKey: "parent_id",
  });
};
