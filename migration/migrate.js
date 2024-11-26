const sequelize = require('../database/sequelize');
const Puskesmas = require('./models/Puskesmas');
const Dokter = require('./models/Dokter');
const Account = require('./models/Account');

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
