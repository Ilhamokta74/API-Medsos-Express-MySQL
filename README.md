# Dokumentasi API

Dokumentasi ini menjelaskan cara menggunakan API yang telah disediakan.

## Persyaratan
- Node.js >= 14.x
- MySQL

## Instalasi
1. Clone repositori ini
2. Jalankan `npm install` untuk menginstal dependensi
3. Konfigurasi database di `.env` file

## Migration Database
1. Buka MySQL Panel Kalian
2. Buat Database Dengan Nama "medsosdbjs"
3. Jalankan `npm run migrate` untuk Menjalankan Fitur Migrate Database

## Daftar Endpoints

### 1. **User API**

#### a. **POST /users/register**
Mendaftarkan pengguna baru.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "age": integer
}
