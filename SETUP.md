# Setup Supabase untuk Octarian Company

## Konfigurasi browser

1. Buat project Supabase dan aktifkan provider **Email** di Authentication.
2. Buka `auth/supabase-config.js`.
3. Ganti `YOUR_SUPABASE_PROJECT_URL` dengan Project URL dan `YOUR_SUPABASE_PUBLISHABLE_KEY` dengan **publishable key** (atau anon key lama bila project Anda masih menggunakannya).
4. Jangan pernah memasukkan `service_role`, secret key, database password, atau connection string pada file frontend maupun GitHub.
5. Di Authentication > URL Configuration, tambahkan URL lokal, misalnya `http://localhost:8000`, ke Redirect URLs. Atur Site URL sesuai deployment Anda.

Project URL dan publishable/anon key memang dipakai browser dan bukan rahasia server. Akses tetap dibatasi oleh RLS di database.

## Jalankan migration manual

1. Buka Supabase Dashboard > SQL Editor.
2. Salin seluruh isi `supabase/migrations/20261025_create_profiles.sql`.
3. Jalankan query tersebut sekali.

Migration membuat tabel `public.profiles`, trigger untuk profil saat pengguna dibuat, dan RLS. Pengguna `authenticated` hanya dapat membaca dan memperbarui baris yang `id`-nya sama dengan `auth.uid()`. Role `anon` tidak diberi akses.

## Menjalankan website lokal

Jalankan server statis dari root repository:

```powershell
python -m http.server 8000
```

Buka `http://localhost:8000`. Jangan membuka HTML lewat `file://`, karena redirect verifikasi email dan integrasi web memerlukan origin HTTP(S).

## Menguji alur dan RLS

1. Buka `auth/register.html`, isi nama, email, dan kata sandi minimal 8 karakter.
2. Bila Confirm email aktif, buka tautan verifikasi lalu masuk melalui `auth/login.html`.
3. Masuk dan periksa `auth/profile.html`; email dan nama harus tampil.
4. Ubah nama lalu simpan. Perubahan harus hanya diterima pada profil pengguna yang sedang masuk.
5. Tekan **Keluar** lalu buka `auth/profile.html`; halaman harus mengarahkan ke login.
6. Buat dua akun test. Dengan token akun kedua, usaha membaca atau memperbarui `profiles.id` milik akun pertama harus gagal/tidak menghasilkan baris karena RLS.

## File yang Anda edit sendiri

- `auth/supabase-config.js`: hanya Project URL dan publishable/anon key.
- Pengaturan Email dan Redirect URLs: melalui Supabase Dashboard.
- `supabase/migrations/20261025_create_profiles.sql`: jalankan manual; bukan dari frontend.

## Jangan masukkan ke GitHub

- Database password, connection string, private/service-role key, secret key, atau personal access token.
- File `.env` atau `.env.*` yang mengandung kredensial.
- `auth/supabase-config.local.js` bila Anda membuat konfigurasi lokal alternatif.

`.gitignore` sudah mengecualikan file lokal tersebut. `auth/supabase-config.js` hanya boleh berisi Project URL + publishable/anon key, bukan rahasia server.
