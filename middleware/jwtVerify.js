const jwt = require('jsonwebtoken');

// Kunci rahasia untuk menandatangani JWT
const secretKey = 'your_secret_key';

const jwtVerify = (req, res, next) => {
    // Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    // Jika tidak ada token
    if (!token) {
        return res.status(401).json({
            statusCode: 401,
            status: "Error",
            message: "Access denied. No token provided.",
        });
    }

    // Verifikasi token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({
                statusCode: 403,
                status: "Error",
                message: "Invalid or expired token.",
            });
        }

        // Token valid, simpan informasi user ke req
        req.user = user;
        next(); // Lanjut ke middleware berikutnya
    });
};

module.exports = jwtVerify;
