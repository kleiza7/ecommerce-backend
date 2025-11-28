import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { USER_ROLE } from '../enums/UserRole.enum';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: USER_ROLE;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(USER_ROLE.USER, USER_ROLE.SELLER),
      defaultValue: USER_ROLE.USER,
    },
  },
  {
    sequelize,
    modelName: 'User',
  },
);
