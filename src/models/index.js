const fs = require('fs');
const Sequelize = require('sequelize');
const path = require('path');

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

const db = {};

fs.readdirSync(__dirname)
    .filter(function(file) {
        return file.indexOf('.') !== 0 && file !== 'index.js';
    })
    .forEach(function(file) {
        // var model = sequelize.import(path.join(__dirname, file));
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db[Sequelize] = Sequelize;
db[sequelize] = sequelize;

module.exports = db;