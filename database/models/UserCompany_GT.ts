import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class UserCompany_GT extends Model<InferAttributes<UserCompany_GT>, InferCreationAttributes<UserCompany_GT>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare NIT: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof UserCompany_GT {
    UserCompany_GT.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        NIT: {
          type: new DataTypes.STRING(128),
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
        tableName: "user_company_gt",
        sequelize, // passing the `sequelize` instance is required
      },
    );

    return UserCompany_GT;
  }
}
