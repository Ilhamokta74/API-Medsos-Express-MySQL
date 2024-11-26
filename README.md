# Dokumentasi API

Dokumentasi ini menjelaskan cara menggunakan API yang telah disediakan.

## Persyaratan
- Node.js >= 14.x
- MySQL

## Instalasi
1. Clone repositori ini
2. Jalankan `npm install` untuk menginstal dependensi
3. Konfigurasi database di `.env` file

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
