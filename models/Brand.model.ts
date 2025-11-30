import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface BrandAttributes {
  id: number;
  name: string;
}

export interface BrandCreationAttributes
  extends Optional<BrandAttributes, "id"> {}

export class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  public id!: number;
  public name!: string;
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
  },
  {
    sequelize,
    modelName: "Brand",
    tableName: "Brands",
  }
);
