require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = new Sequelize('ecommerce', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit the process with an error code
  });

// Sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});
