require('dotenv').config({ path: `../.env` });
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Koneksi ke database MySQL
const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

console.log(host, user, password, database)

// Ganti dengan detail koneksi Anda
const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
});

module.exports = sequelize;