import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface CartItemAttributes {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price_snapshot: number;
}

export interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id" | "price_snapshot"> {}

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: number;
  public cart_id!: number;
  public product_id!: number;
  public quantity!: number;
  public price_snapshot!: number;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Carts",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price_snapshot: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "CartItems",
  }
);
