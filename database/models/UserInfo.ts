import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class UserInfo extends Model<InferAttributes<UserInfo>, InferCreationAttributes<UserInfo>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare name: string;
  declare lastname: string;
  declare openai_thread_id: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof UserInfo {
    UserInfo.init(
      {
        id: {
          type: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
          defaultValue: DataTypes.UUIDV4,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        name: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        lastname: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        openai_thread_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        tableName: "user_info",
        sequelize, // passing the `sequelize` instance is required
      },
    );

    return UserInfo;
  }
}
