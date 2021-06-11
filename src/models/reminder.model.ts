module.exports = (sequelize, Sequelize) => {
    const Reminder = sequelize.define(
      "Reminder",
      {
        reminderId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        dateCreation: {
          type: Sequelize.DATE,
          allowNull: false
        },
        dateRappel: {
          type: Sequelize.DATE,
          allowNull: false
        },
        author: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        serverId: {
          type: Sequelize.STRING(250),
          allowNull: false
      },
        channelId: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        message: {
            type: Sequelize.STRING(250),
            allowNull: false
        }
      },
      {
        tableName: "reminder",
        timestamps: false,
        freezeTableName: true,
      }
    );

    return Reminder;
  };
