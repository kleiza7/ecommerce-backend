import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface CartAttributes {
  id: number;
  user_id: number;
}

export interface CartCreationAttributes
  extends Optional<CartAttributes, "id"> {}

export class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public user_id!: number;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "Carts",
  }
);
