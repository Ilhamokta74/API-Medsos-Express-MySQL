const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');
const User = require('./User');

const Photo = sequelize.define('Photo', {
    uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Validasi agar username menjadi unique
        validate: {
            notEmpty: {
                msg: 'UUID tidak boleh kosong',
            },
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Title tidak boleh kosong', // Validasi agar title tidak kosong
            },
        },
    },
    caption: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    photo_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Photo URL tidak boleh kosong', // Validasi agar photo_url tidak kosong
            },
        },
    },
    user_id: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'uuid',
        },
        allowNull: false,
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
    tableName: 'photos',
    timestamps: false,
});

module.exports = Photo;
