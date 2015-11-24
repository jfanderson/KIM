var Sequelize = require('sequelize');

var dbURL = process.env.DATABASE_URL;

if (dbURL) {
  var db = new Sequelize(dbURL);
} else {
  var db = new Sequelize('kim', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });
}

module.exports = db;
