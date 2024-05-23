require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;