import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class UserAddress extends Model<InferAttributes<UserAddress>, InferCreationAttributes<UserAddress>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare country: string;
  declare city: string;
  declare address_1: string;
  declare address_2: string;
  declare zip_code: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof UserAddress {
    UserAddress.init(
      {
        id: {
          type: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
          defaultValue: DataTypes.UUIDV4,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address_1: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address_2: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        zip_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        tableName: "user_address",
        sequelize, // passing the `sequelize` instance is required
      },
    );

    return UserAddress;
  }
}
