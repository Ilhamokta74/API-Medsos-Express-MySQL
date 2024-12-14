const jwt = require('jsonwebtoken');

// Kunci rahasia untuk menandatangani JWT
const secretKey = 'your_secret_key';

const jwtToken = async (email, username) => {
    try {
        const payload = {
            "email": email,
            "username": username,
            "roles": "user",
        }

        const expiresIn = '1h';

        // Membuat token dengan payload dan durasi kadaluarsa
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (error) {
        console.error('Error generating JWT:', error.message);
        throw error;
    }
};

module.exports = jwtToken;