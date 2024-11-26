// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Puskesmas = sequelize.define('Puskesmas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    namaPuskesmas: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alamatPuskesmas: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noTelepon: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maps: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    tableName: 'puskesmas', // Nama tabel di database
});

module.exports = Puskesmas;
