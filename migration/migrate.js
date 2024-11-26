const sequelize = require('../database/sequelize');

// Set up the relationships between models
const User = require('./models/User');
const Photo = require('./models/Photo');
const Comment = require('./models/Comment');
const SocialMedia = require('./models/SocialMedia');

// One-to-many relationship between User and Photo
User.hasMany(Photo, { foreignKey: 'user_id' });
Photo.belongsTo(User, { foreignKey: 'user_id' });

// One-to-many relationship between User and Comment
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// One-to-many relationship between Photo and Comment
Photo.hasMany(Comment, { foreignKey: 'photo_id' });
Comment.belongsTo(Photo, { foreignKey: 'photo_id' });

// One-to-many relationship between User and SocialMedia
User.hasMany(SocialMedia, { foreignKey: 'user_id' });
SocialMedia.belongsTo(User, { foreignKey: 'user_id' });

// Inisialisasi model
async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Koneksi berhasil!');

        // Sinkronisasi model ke database
        await sequelize.sync({ force: true }); // Hati-hati dengan `force: true`, ini akan menghapus tabel yang ada!

        console.log('Migrasi berhasil!');
    } catch (error) {
        console.error('Terjadi kesalahan saat migrasi:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
