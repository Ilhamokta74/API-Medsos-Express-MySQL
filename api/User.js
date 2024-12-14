const nanoid = require('nanoid');
const bcrypt = require('bcrypt'); // Tambahkan bcrypt

const db = require('../database/database'); // Database connection
const jwtToken = require(`../middleware/jwt`);

// Ambil Data User
const getDataUser = async (req, res) => {
    const { id } = req.params; // Ambil parameter id jika ada

    const datas_query = "id, username, email, age, created_at, updated_at"

    // Query untuk semua data atau data berdasarkan ID
    const query = id
        ? `SELECT ${datas_query} FROM users WHERE id = ?`
        : `SELECT ${datas_query} FROM users`;

    // Parameter untuk query
    const params = id ? [id] : [];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            return res.status(500).json({
                responseCode: 500,
                message: 'Gagal mengambil data pengguna.',
                data: null,
            });
        }

        // Jika pengguna tidak ditemukan (berdasarkan ID)
        if (id && results.length === 0) {
            return res.status(404).json({
                responseCode: 404,
                message: 'Pengguna tidak ditemukan.',
                data: null,
            });
        }

        // Respons sukses
        res.status(200).json({
            responseCode: 200,
            message: 'Data pengguna berhasil diambil.',
            data: results,
        });
    });
};

// Tambah Data User
const AddDataUser = async (req, res) => {
    const { Username, Email, Password, Age } = req.body;

    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();

    if (!Username || !Email || !Password || !Age) {
        return res.status(400).json({
            responseCode: 400,
            message: 'Semua data (Username, Email, Password, Age) harus diisi.',
        });
    }

    // Hash password sebelum menyimpan
    const HashPassword = await bcrypt.hash(Password, 10); // SaltRounds = 10

    const query = 'INSERT INTO users (username, email, password, age, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [Username, Email, HashPassword, Age, created_at, updated_at], (err, results) => {
        if (err) {
            console.error('Error adding user:', err.message);

            // Default error message
            let error = 'Gagal menambahkan pengguna.';

            // Tangani error duplikasi berdasarkan pesan
            if (err.code === 'ER_DUP_ENTRY') {
                if (err.message.includes('email')) {
                    error = 'Email sudah digunakan.';
                } else if (err.message.includes('username')) {
                    error = 'Username sudah digunakan.';
                }
            }

            res.status(409).json({ // Ubah status menjadi 409 untuk konflik (duplikasi data)
                responseCode: 409,
                message: error,
            });
            return;
        }

        res.status(201).json({
            responseCode: 201,
            message: 'Pengguna berhasil ditambahkan.',
            data: {
                id: results.insertId,
                Username,
                Email,
                Age,
                created_at,
                updated_at
            },
        });
    });
};

// Update Data User
const UpdateDataUser = async (req, res) => {
    const { id } = req.params;
    const { Username, Email, Password, Age } = req.body;

    const updated_at = new Date().toISOString();

    if (!id) {
        return res.status(400).json({
            responseCode: 400,
            message: 'ID pengguna harus disertakan untuk memperbarui data.',
        });
    }

    // Hash password sebelum menyimpan
    const HashPassword = await bcrypt.hash(Password, 10); // SaltRounds = 10

    const query = 'UPDATE users SET username = ?, email = ?, password = ?, age = ?, updated_at = ? WHERE id = ?';
    db.query(query, [Username, Email, HashPassword, Age, updated_at, id], (err, results) => {
        if (err) {
            console.error('Error adding user:', err.message);

            // Default error message
            let error = 'Gagal diperbarui pengguna.';

            // Tangani error duplikasi berdasarkan pesan
            if (err.code === 'ER_DUP_ENTRY') {
                if (err.message.includes('email')) {
                    error = 'Email sudah digunakan.';
                } else if (err.message.includes('username')) {
                    error = 'Username sudah digunakan.';
                }
            }

            res.status(409).json({ // Ubah status menjadi 409 untuk konflik (duplikasi data)
                responseCode: 409,
                message: error,
            });
            return;
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                responseCode: 404,
                message: 'Pengguna tidak ditemukan.',
            });
        }

        res.status(200).json({
            responseCode: 200,
            message: 'Data pengguna berhasil diperbarui.',
        });
    });
};

// Hapus Data User
const DeleteDataUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            responseCode: 400,
            message: 'ID pengguna harus disertakan untuk menghapus data.',
        });
    }

    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            res.status(500).json({
                responseCode: 500,
                message: 'Gagal menghapus pengguna.',
            });
            return;
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                responseCode: 404,
                message: 'Pengguna tidak ditemukan.',
            });
        }

        res.status(200).json({
            responseCode: 200,
            message: 'Pengguna berhasil dihapus.',
        });
    });
};

const loginUser = async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({
            responseCode: 400,
            message: 'Email dan Password harus diisi.',
        });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [Email], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({
                responseCode: 500,
                message: 'Gagal mengambil data pengguna.',
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                responseCode: 404,
                message: 'Pengguna tidak ditemukan.',
            });
        }

        const user = results[0];

        const username = results[0].username;

        // Bandingkan password yang dimasukkan dengan hash di database
        const isMatch = await bcrypt.compare(Password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                responseCode: 401,
                message: 'Password salah.',
            });
        }

        res.status(200).json({
            responseCode: 200,
            message: 'Login berhasil.',
            data: {
                Token: await jwtToken(Email, username),
                expiresIn: 3600
            },
        });
    });
};

module.exports = {
    AddDataUser, DeleteDataUser, UpdateDataUser, getDataUser, loginUser,
}