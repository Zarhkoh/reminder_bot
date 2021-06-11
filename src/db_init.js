require('dotenv').config();
const Reminder = require('./models').Reminder;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PWD, {
        host: process.env.DB_URL,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: 30,
            min: 0,
            idle: 30000,
            acquire: 200000,
        },
        define: {
            underscored: false,
            freezeTableName: true,
            timestamps: true,
            charset: 'utf8',
        }
    }
);

module.exports.init = function() {
    try {
        sequelize.authenticate();
        console.log('Connexion à la base de données effectuée avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
    //DB TABLES SYNC
    Reminder.sync({ force: false });
}