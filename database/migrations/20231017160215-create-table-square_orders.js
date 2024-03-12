const DataTypes = require("sequelize").DataTypes;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("square_orders", {
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("square_orders");
  },
};
