// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Account = sequelize.define('Account', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // createdAt: {
    //     type: DataTypes.TIME,
    //     allowNull: false,
    // },
    // updatedAt: {
    //     type: DataTypes.TIME,
    //     allowNull: false,
    // },
    // Tambahkan kolom lain sesuai kebutuhan
}, {
    tableName: 'account', // Nama tabel di database
});

module.exports = Account;
