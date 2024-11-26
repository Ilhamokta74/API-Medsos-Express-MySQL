const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Validasi agar username menjadi unique
        validate: {
            notEmpty: {
                msg: 'Username tidak boleh kosong',
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Validasi agar email menjadi unique
        validate: {
            isEmail: {
                msg: 'Format email tidak valid', // Validasi format email
            },
            notEmpty: {
                msg: 'Email tidak boleh kosong',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password tidak boleh kosong',
            },
            len: {
                args: [6, Infinity],
                msg: 'Password minimal harus 6 karakter',
            },
        },
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Age tidak boleh kosong',
            },
            min: {
                args: [9],
                msg: 'Age minimal harus lebih dari 8',
            },
        },
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;
