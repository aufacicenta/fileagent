import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model, Sequelize } from "sequelize";

type LineItem = {
  uid: string;
  catalog_object_id: string;
  catalog_version: number;
  quantity: string;
  name: string;
  variation_name: string;
  base_price_money: Money;
  gross_sales_money: Money;
  total_tax_money: Money;
  total_discount_money: Money;
  total_money: Money;
  variation_total_price_money: Money;
  item_type: string;
  total_service_charge_money: Money;
};

type Tender = {
  id: string;
  location_id: string;
  transaction_id: string;
  created_at: string;
  note: string;
  amount_money: Money;
  processing_fee_money: Money;
  customer_id: string;
  type: string;
};

type Money = {
  amount: number;
  currency: string;
};

type ReturnAmounts = {
  total_money: Money;
  tax_money: Money;
  discount_money: Money;
  tip_money: Money;
  service_charge_money: Money;
};

type NetAmounts = {
  total_money: Money;
  tax_money: Money;
  discount_money: Money;
  tip_money: Money;
  service_charge_money: Money;
};

export class SquareOrder extends Model<InferAttributes<SquareOrder>, InferCreationAttributes<SquareOrder>> {
  declare id: CreationOptional<string>;
  declare location_id: string;
  declare line_items: LineItem[];
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare state: string;
  declare total_tax_money: Money;
  declare total_discount_money: Money;
  declare total_tip_money: Money;
  declare total_money: Money;
  declare closed_at: Date;
  declare tenders: Tender[];
  declare total_service_charge_money: Money;
  declare return_amounts: ReturnAmounts;
  declare net_amounts: NetAmounts;
  declare source: object;
  declare customer_id: string;
  declare net_amount_due_money: Money;

  static initModel(sequelize: Sequelize): typeof SquareOrder {
    SquareOrder.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        location_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        line_items: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        total_tax_money: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        total_discount_money: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        total_tip_money: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        total_money: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        closed_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        tenders: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        total_service_charge_money: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        return_amounts: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        net_amounts: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        source: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        customer_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        net_amount_due_money: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
      },
      {
        sequelize,
      },
    );
    return SquareOrder;
  }
}
