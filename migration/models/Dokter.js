// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Dokter = sequelize.define('Dokter', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    namaDokter: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poli: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jamPraktek: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jadwalPraktek: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    puskesmasId: {
        type: DataTypes.INTEGER,
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
    tableName: 'dokter', // Nama tabel di database
});

module.exports = Dokter;
