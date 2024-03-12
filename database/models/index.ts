import type { Sequelize } from "sequelize";
import { ContentExtraction } from "./ContentExtraction";
import { SquareOrder } from "./SquareOrder";
import { UserInfo } from "./UserInfo";
import { UserAddress } from "./UserAddress";
import { UserCompany } from "./UserCompany";
import { UserCompany_GT } from "./UserCompany_GT";
import { UserSession } from "./UserSession";
import { User } from "./User";

export { ContentExtraction, SquareOrder, UserInfo, UserAddress, UserCompany, UserCompany_GT, UserSession };

export function initModels(sequelize: Sequelize) {
  ContentExtraction.initModel(sequelize);
  SquareOrder.initModel(sequelize);
  UserInfo.initModel(sequelize);
  UserAddress.initModel(sequelize);
  UserCompany.initModel(sequelize);
  UserCompany_GT.initModel(sequelize);
  UserSession.initModel(sequelize);

  return {
    ContentExtraction,
    SquareOrder,
    UserInfo,
    UserAddress,
    UserCompany,
    UserCompany_GT,
    UserSession,
  };
}
