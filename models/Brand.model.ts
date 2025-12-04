import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface BrandAttributes {
  id: number;
  name: string;
  slug: string;
}

export interface BrandCreationAttributes
  extends Optional<BrandAttributes, "id" | "slug"> {}

export class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
}

Brand.init(
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
  },
  {
    sequelize,
    modelName: "Brand",
    tableName: "Brands",
  }
);
