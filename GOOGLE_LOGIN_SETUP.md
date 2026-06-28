# Setup Google Login — DuckStation

## 1. Google Cloud Console
1. Buka https://console.cloud.google.com
2. Buat Project baru → Nama: **DuckStation**
3. Klik **APIs & Services** → **OAuth consent screen**
   - User type: **External**
   - App name: **DuckStation**
   - User support email: email kamu
   - Developer contact: email kamu
   - Scopes: tambah `email` dan `profile`
   - Test users: tambah email Google kamu
4. Klik **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: **DuckStation Web**
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
5. Catat **Client ID** dan **Client Secret**

## 2. Update .env

### backend/.env
```
GOOGLE_CLIENT_ID=paste_client_id_di_sini
GOOGLE_CLIENT_SECRET=paste_client_secret_di_sini
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

### frontend/.env
```
VITE_GOOGLE_CLIENT_ID=paste_client_id_di_sini
```

## 3. Start
```bash
# Dari root project
npm run dev

# Atau manual
cd backend && npm run dev   # port 5000
cd frontend && npm run dev  # port 5173
```

## 4. Cara Kerja
- User klik "Login with Google"
- Google Identity Services menampilkan popup Google
- Setelah user approve, Google mengirim credential JWT ke frontend
- Frontend mengirim credential ke `POST /api/auth/google/verify`
- Backend decode JWT, cek/create user, return JWT token DuckStation
- Token disimpan di localStorage
- User diarahkan ke `/dashboard`

## 5. Fallback (jika Google Identity Services belum load)
- Tombol "Continue with Google" juga bisa redirect ke backend
- Backend menggunakan Passport.js Google OAuth
- Setelah auth, redirect balik ke frontend dengan token

## Troubleshooting
- **"Google Auth Failed"**: Pastikan Client ID benar di kedua .env
- **"Redirect URI mismatch"**: Pastikan redirect URI di Google Console sama persis
- **CORS error**: Pastikan FRONTEND_URL di backend/.env = `http://localhost:5173`
