const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');
const User = require('./User');
const Photo = require('./Photo');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    photo_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Photo,
            key: 'id',
        },
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
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
    tableName: 'comments',
    timestamps: false,
});

module.exports = Comment;
