const nanoid = require('nanoid');
const bcrypt = require('bcrypt'); // Tambahkan bcrypt
const path = require('path'); // Modul untuk memproses path file

const upload = require('../middleware/upload');
const db = require('../database/database'); // Database connection

// Ambil Data Photo
const getDataPhoto = async (req, res) => {
    const { id } = req.params;
    const query = id ? 'SELECT * FROM Photos WHERE id = ?' : 'SELECT * FROM Photos';
    const params = id ? [id] : [];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching Photo data:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal mengambil data.'});
        }

        if (id && results.length === 0) {
            return res.status(404).json({ responseCode: 404, message: 'Data tidak ditemukan.'});
        }

        res.status(200).json({ responseCode: 200, message: 'Data berhasil diambil.', data: results });
    });
};

// Tambah Data Photo
const AddDataPhoto = async (req, res) => {
    // Data payload dari token
    const userData = req.user;

    upload.single('photo')(req, res, async (err) => {
        const folderPath = await req.folderPath;

        const { title, caption } = req.body;

        if (err) {
            console.log(err);
            return res.status(400).json({ responseCode: 400, message: 'Gagal mengunggah file.' });
        }

        const photo_url = req.file ? `/uploads/${folderPath}` : null;
        const user_id = userData.username;
        const created_at = new Date().toISOString();
        const updated_at = created_at;

        const query = 'INSERT INTO photos (title, caption, photo_url, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(query, [title, caption, photo_url, user_id, created_at, updated_at], (err, results) => {
            if (err) {
                console.error('Error adding Photo:', err.message);
                const error = err.code === 'ER_DUP_ENTRY' ? 'Photoname sudah Tersedia' : 'Gagal menambahkan data.';
                return res.status(409).json({ responseCode: 409, message: error });
            }

            res.status(201).json({
                responseCode: 201,
                message: 'Data berhasil ditambahkan.',
                data: { title, caption, Photo: photo_url, created_at, updated_at },
            });
        });
    });
};

// Update Data Photo
const UpdateDataPhoto = async (req, res) => {
    const { id } = req.params;

    // Data payload dari token
    const userData = req.user;

    const { title, caption } = req.body;

    if (!id) {
        return res.status(400).json({ responseCode: 400, message: 'ID harus disertakan.' });
    }

    const updated_at = new Date().toISOString();

    const query = `
        UPDATE photos 
        SET title = ?, caption = ?, updated_at = ? 
        WHERE id = ?`;

    const params = [title, caption, updated_at, id]

    db.query(query, params, (err, results) => {
        console.log(results)
        // if (err) {
        //     console.error('Error updating Photo:', err.message);
        //     return res.status(500).json({ responseCode: 500, message: 'Gagal memperbarui data.' });
        // }

        // if (results.affectedRows === 0) {
        //     return res.status(404).json({ responseCode: 404, message: 'Data tidak ditemukan.' });
        // }

        // res.status(200).json({ responseCode: 200, message: 'Data berhasil diperbarui.' });
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

// Download File
const cekPhotos = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, `../uploads/${filename}`);
    console.log(filePath);

    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal mengunduh file.' });
        }
    });
};

module.exports = { AddDataPhoto, DeleteDataPhoto, UpdateDataPhoto, getDataPhoto, cekPhotos };