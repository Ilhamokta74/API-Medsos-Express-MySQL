const jwt = require('jsonwebtoken');

// Kunci rahasia untuk menandatangani JWT
const secretKey = 'your_secret_key';

const jwtToken = async (email, username, userId) => {
    try {
        const payload = {
            "user_id": userId,
            "email": email,
            "username": username,
            "roles": "user",
        }

        const expiresIn = '1w';

        // Membuat token dengan payload dan durasi kadaluarsa
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (error) {
        console.error('Error generating JWT:', error.message);
        throw error;
    }
};

module.exports = jwtToken;