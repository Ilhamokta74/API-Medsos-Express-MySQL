const nanoid = require('nanoid');
const bcrypt = require('bcrypt'); // Tambahkan bcrypt

const db = require('../database/database'); // Database connection
const jwtToken = require(`../middleware/jwt`);

// Ambil Data Photo
const getDataPhoto = async (req, res) => {
    const { id } = req.params;
    const query = id ? 'SELECT * FROM Photos WHERE id = ?' : 'SELECT * FROM Photos';
    const params = id ? [id] : [];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching Photo data:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal mengambil data.', data: null });
        }

        if (id && results.length === 0) {
            return res.status(404).json({ responseCode: 404, message: 'Data tidak ditemukan.', data: null });
        }

        res.status(200).json({ responseCode: 200, message: 'Data berhasil diambil.', data: results });
    });
};

// Tambah Data Photo
const AddDataPhoto = async (req, res) => {
    upload.single('Photo')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ responseCode: 400, message: 'Gagal mengunggah file.' });
        }

        const { Photoname, Email, Password, Age } = req.body;
        const PhotoPath = req.file ? req.file.path : null;

        if (!Photoname || !Email || !Password || !Age) {
            return res.status(400).json({ responseCode: 400, message: 'Semua data harus diisi.' });
        }

        const HashPassword = await bcrypt.hash(Password, 10);
        const query = 'INSERT INTO Photos (Photoname, email, password, age, photo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const created_at = new Date().toISOString();
        const updated_at = created_at;

        db.query(query, [Photoname, Email, HashPassword, Age, PhotoPath, created_at, updated_at], (err, results) => {
            if (err) {
                console.error('Error adding Photo:', err.message);
                const error = err.code === 'ER_DUP_ENTRY' ? 'Email atau Photoname sudah digunakan.' : 'Gagal menambahkan data.';
                return res.status(409).json({ responseCode: 409, message: error });
            }

            res.status(201).json({
                responseCode: 201,
                message: 'Data berhasil ditambahkan.',
                data: { id: results.insertId, Photoname, Email, Age, Photo: PhotoPath, created_at, updated_at },
            });
        });
    });
};

// Update Data Photo
const UpdateDataPhoto = async (req, res) => {
    const { id } = req.params;
    const { Photoname, Email, Password, Age } = req.body;

    if (!id) {
        return res.status(400).json({ responseCode: 400, message: 'ID harus disertakan.' });
    }

    const HashPassword = Password ? await bcrypt.hash(Password, 10) : null;
    const updated_at = new Date().toISOString();

    const query = `
        UPDATE Photos 
        SET Photoname = ?, email = ?, ${Password ? 'password = ?,' : ''} age = ?, updated_at = ? 
        WHERE id = ?`;

    const params = Password
        ? [Photoname, Email, HashPassword, Age, updated_at, id]
        : [Photoname, Email, Age, updated_at, id];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating Photo:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal memperbarui data.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ responseCode: 404, message: 'Data tidak ditemukan.' });
        }

        res.status(200).json({ responseCode: 200, message: 'Data berhasil diperbarui.' });
    });
};

// Hapus Data Photo
const DeleteDataPhoto = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ responseCode: 400, message: 'ID harus disertakan.' });
    }

    const query = 'DELETE FROM Photos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting Photo:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal menghapus data.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ responseCode: 404, message: 'Data tidak ditemukan.' });
        }

        res.status(200).json({ responseCode: 200, message: 'Data berhasil dihapus.' });
    });
};

// Login Photo
const loginPhoto = async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ responseCode: 400, message: 'Email dan Password harus diisi.' });
    }

    const query = 'SELECT * FROM Photos WHERE email = ?';
    db.query(query, [Email], async (err, results) => {
        if (err) {
            console.error('Error fetching Photo:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal mengambil data pengguna.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ responseCode: 404, message: 'Pengguna tidak ditemukan.' });
        }

        const Photo = results[0];
        const isMatch = await bcrypt.compare(Password, Photo.password);

        if (!isMatch) {
            return res.status(401).json({ responseCode: 401, message: 'Password salah.' });
        }

        res.status(200).json({ responseCode: 200, message: 'Login berhasil.', data: { Token: await jwtToken(Email), expiresIn: 3600 } });
    });
};

// Download File
const downloadPhoto = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal mengunduh file.' });
        }
    });
};

module.exports = { AddDataPhoto, DeleteDataPhoto, UpdateDataPhoto, getDataPhoto, loginPhoto, downloadPhoto };