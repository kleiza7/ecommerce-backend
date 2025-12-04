import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  description?: string | null;
  display_order: number;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "parent_id" | "description"> {}

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
  public parent_id!: number | null;
  public description!: string | null;
  public display_order!: number;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Categories", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "Categories",
  }
);
