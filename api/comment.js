const { v4: uuidv4 } = require('uuid');

const db = require('../database/database'); // Database connection

// Tambah Komentar pada Photo
const AddComment = async (req, res) => {
    const UUID = uuidv4();

    const { id } = req.params;
    const { message } = req.body;
    const user_id = req.user.user_id; // Data dari token pengguna
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    if (!id || !message) {
        return res.status(400).json({ responseCode: 400, message: 'Photo ID dan komentar harus disertakan.' });
    }

    const query = `
        INSERT INTO comments (uuid, photo_id, user_id, message, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [UUID, id, user_id, message, created_at, updated_at], (err, results) => {
        if (err) {
            console.error('Error adding comment:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal menambahkan komentar.' });
        }

        res.status(201).json({
            responseCode: 201,
            message: 'Komentar berhasil ditambahkan.',
            data: { UUID, "photo_id":id, user_id, message, created_at, updated_at }
        });
    });
};

// Ambil Semua Komentar untuk Photo
const GetComments = async (req, res) => {
    const { id } = req.params; // Ambil parameter UUID jika ada

    const datas_query = "uuid, photo_id, user_id, message, created_at, updated_at"

    // Query untuk semua data atau data berdasarkan ID
    const query = id
        ? `SELECT ${datas_query} FROM comments WHERE uuid = ?`
        : `SELECT ${datas_query} FROM comments`;

    // Parameter untuk query
    const params = id ? [id] : [];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            return res.status(500).json({
                responseCode: 500,
                message: 'Gagal mengambil data pengguna.',
                // data: null,
            });
        }

        // Jika pengguna tidak ditemukan (berdasarkan ID)
        if (id && results.length === 0) {
            return res.status(404).json({
                responseCode: 404,
                message: 'Komentar tidak ditemukan.',
                // data: null,
            });
        }

        // Respons sukses
        res.status(200).json({
            responseCode: 200,
            message: 'Data Komentar berhasil diambil.',
            data: results,
        });
    });
};

// Edit Komentar
const UpdateComment = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const updated_at = new Date().toISOString();
    const user_id = req.user.user_id; // Data dari token pengguna untuk memastikan otorisasi

    if (!id || !message) {
        return res.status(400).json({ responseCode: 400, message: 'Comment ID dan isi komentar harus disertakan.' });
    }

    // Cek apakah komentar milik pengguna saat ini
    const checkQuery = 'SELECT * FROM comments WHERE uuid = ? AND user_id = ?';
    db.query(checkQuery, [id, user_id], (err, results) => {
        if (err) {
            console.error('Error verifying comment ownership:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal memverifikasi komentar.' });
        }

        if (results.length === 0) {
            return res.status(403).json({ responseCode: 403, message: 'Anda tidak memiliki akses untuk mengedit komentar ini.' });
        }

        // Update komentar jika valid
        const updateQuery = `
            UPDATE comments 
            SET message = ?, updated_at = ? 
            WHERE uuid = ? AND user_id = ?`;

        db.query(updateQuery, [message, updated_at, id, user_id], (err, results) => {
            if (err) {
                console.error('Error updating comment:', err.message);
                return res.status(500).json({ responseCode: 500, message: 'Gagal memperbarui komentar.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ responseCode: 404, message: 'Komentar tidak ditemukan.' });
            }

            res.status(200).json({
                responseCode: 200,
                message: 'Komentar berhasil diperbarui.',
            });
        });
    });
};

// Hapus Komentar
const DeleteComment = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ responseCode: 400, message: 'Comment ID harus disertakan.' });
    }

    const query = 'DELETE FROM comments WHERE uuid = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting comment:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal menghapus komentar.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ responseCode: 404, message: 'Komentar tidak ditemukan.' });
        }

        res.status(200).json({ responseCode: 200, message: 'Komentar berhasil dihapus.' });
    });
};

module.exports = { AddComment, GetComments, UpdateComment, DeleteComment };