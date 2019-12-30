const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('./db.config');

let db = {};
let sequelize = new Sequelize(config.database, config.username, config.password, config.options);

fs
   .readdirSync(__dirname + "/dataModels")
   .filter(file => (file.indexOf(".") !== 0) && (file !== 'index.js'))
   .forEach(file => {
       let model = sequelize.import(path.join(__dirname + "/dataModels", file));
       db[model.name] = model;
   });

Object.keys(db).forEach(modelName => {
   if("associate" in db[modelName]) {
       db[modelName].associate(db);
   }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;