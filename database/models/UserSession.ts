import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { User } from "./User";

export class UserSession extends Model<InferAttributes<UserSession>, InferCreationAttributes<UserSession>> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare messagebird_participant_id: string;
  declare openai_thread_id: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare static associations: {
    user: Association<UserSession, User>;
  };

  static initModel(sequelize: Sequelize): typeof UserSession {
    UserSession.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        openai_thread_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        messagebird_participant_id: {
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
        tableName: "user_session",
        sequelize, // passing the `sequelize` instance is required
      },
    );

    return UserSession;
  }
}
