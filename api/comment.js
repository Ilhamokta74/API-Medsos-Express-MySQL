// Tambah Komentar pada Photo
const AddComment = async (req, res) => {
    const { photo_id, comment } = req.body;
    const user_id = req.user.username; // Data dari token pengguna
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    if (!photo_id || !comment) {
        return res.status(400).json({ responseCode: 400, message: 'Photo ID dan komentar harus disertakan.' });
    }

    const query = `
        INSERT INTO comments (photo_id, user_id, comment, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [photo_id, user_id, comment, created_at, updated_at], (err, results) => {
        if (err) {
            console.error('Error adding comment:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal menambahkan komentar.' });
        }

        res.status(201).json({ 
            responseCode: 201, 
            message: 'Komentar berhasil ditambahkan.', 
            data: { photo_id, user_id, comment, created_at, updated_at }
        });
    });
};

// Ambil Semua Komentar untuk Photo
const GetComments = async (req, res) => {
    const { photo_id } = req.params;

    if (!photo_id) {
        return res.status(400).json({ responseCode: 400, message: 'Photo ID harus disertakan.' });
    }

    const query = 'SELECT * FROM comments WHERE photo_id = ?';

    db.query(query, [photo_id], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err.message);
            return res.status(500).json({ responseCode: 500, message: 'Gagal mengambil komentar.' });
        }

        res.status(200).json({ responseCode: 200, message: 'Komentar berhasil diambil.', data: results });
    });
};

// Edit Komentar
const UpdateComment = async (req, res) => {
    const { comment_id } = req.params;
    const { comment } = req.body;
    const updated_at = new Date().toISOString();
    const user_id = req.user.username; // Data dari token pengguna untuk memastikan otorisasi

    if (!comment_id || !comment) {
        return res.status(400).json({ responseCode: 400, message: 'Comment ID dan isi komentar harus disertakan.' });
    }

    // Cek apakah komentar milik pengguna saat ini
    const checkQuery = 'SELECT * FROM comments WHERE id = ? AND user_id = ?';
    db.query(checkQuery, [comment_id, user_id], (err, results) => {
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
            SET comment = ?, updated_at = ? 
            WHERE id = ? AND user_id = ?`;
        
        db.query(updateQuery, [comment, updated_at, comment_id, user_id], (err, results) => {
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
                data: { comment_id, comment, updated_at } 
            });
        });
    });
};


// Hapus Komentar
const DeleteComment = async (req, res) => {
    const { comment_id } = req.params;

    if (!comment_id) {
        return res.status(400).json({ responseCode: 400, message: 'Comment ID harus disertakan.' });
    }

    const query = 'DELETE FROM comments WHERE id = ?';

    db.query(query, [comment_id], (err, results) => {
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