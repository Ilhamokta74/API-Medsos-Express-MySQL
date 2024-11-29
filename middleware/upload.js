const multer = require('multer');
const path = require('path');

// Konfigurasi Multer untuk menyimpan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Direktori untuk menyimpan file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nama file unik
    },
});

// Filter untuk hanya menerima file tertentu
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Terima file gambar
    } else {
        cb(new Error('File bukan gambar!'), false); // Tolak file non-gambar
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Maksimal 5 MB
});
