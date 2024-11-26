require('dotenv').config({ path: `../.env` });
const { Sequelize } = require('sequelize');

// Koneksi ke database MySQL
const host = process.env.DB_HOST
const user = process.env.DB_USER || "root"
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

// Ganti dengan detail koneksi Anda
const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
});

module.exports = sequelize;