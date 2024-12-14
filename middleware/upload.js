const multer = require('multer');
const path = require('path'); // Modul untuk memproses path file

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Direktori tempat file akan disimpan
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Ambil ekstensi file
        const filename = uniqueSuffix + extension;

        cb(null, filename); // Simpan file dengan nama unik

        // Simpan payload ke req untuk middleware atau handler berikutnya
        req.folderPath = filename;
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']; // Daftar ekstensi yang diizinkan
        const extension = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            return cb(new Error(`Ekstensi file tidak diizinkan: ${extension}`));
        }

        cb(null, true);
    }
});

module.exports = upload;
