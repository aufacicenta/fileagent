import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class UserCompany extends Model<InferAttributes<UserCompany>, InferCreationAttributes<UserCompany>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare industry: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof UserCompany {
    UserCompany.init(
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
        industry: {
          type: new DataTypes.STRING(128),
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
        tableName: "user_company",
        sequelize, // passing the `sequelize` instance is required
      },
    );

    return UserCompany;
  }
}
