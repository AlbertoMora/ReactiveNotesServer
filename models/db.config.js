require('dotenv').config();
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true
    }
});

conn
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database, please check the next info:', err);
    });

module.exports = conn;