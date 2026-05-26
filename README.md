# Visa Portal — Full Stack Application

## Architecture

```
visa-portal/
├── backend/          # Express + MongoDB API  (port 3000)
├── fr-main/          # React main frontend    (port 5173)
└── Fr-ad/            # React admin panel      (port 5174)
```

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env   # Fill in your values (see Environment Variables below)
npm install
npm run dev
```

### Frontend (main)

```bash
cd fr-main
cp .env.example .env.local
npm install
npm run dev
```

### Admin Panel

```bash
cd Fr-ad
cp .env.example .env.local
npm install
npm run dev
```

## Environment Variables

### backend/.env

| Variable           | Description                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `MONGO_URI`        | MongoDB Atlas connection string                                                                                   |
| `JWT_SECRET`       | 64+ char random string — generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRE`       | Token expiry (default: `1d`)                                                                                      |
| `EMAIL_USER`       | Gmail address foending emails                                                                                     |
| `EMAIL_PASS`       | Gmail app password (not your account password)                                                                    |
| `ALLOWED_ORIGINS`  | Comma-separated list of allowed frontend origins                                                                  |
| `FRONTEND_URL`     | Main frontend URL (used in password reset emails)                                                                 |
| `MAX_FILE_SIZE_MB` | Max upload size in MB (default: 5)                                                                                |
| `UPLOAD_DIR`       | Upload directory path (default: `uploads`)                                                                        |

### fr-main/.env.local

| Variable         | Description                                         |
| ---------------- | --------------------------------------------------- |
| `VITE_API_URL`   | Backend API base URL (e.g. `http://localhost:3000`) |
| `VITE_ADMIN_URL` | Admin panel URL (e.g. `http://localhost:5174`)      |

### Fr-ad/.env.local

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:3000`) |

## Security Notes

- JWT tokens stored in `sessionStorage` (cleared on tab close) across both frontends.
  For maximum security, migrate to httpOnly cookies in production.
- CORS restricted to `ALLOWED_ORIGINS` in `.env`.
- All file uploads validated by MIME type + extension with randomized filenames.
- Rate limiting applied to all API and auth routes.
- NoSQL injection prevented via `express-mongo-sanitize` library.
- XSS input sanitized via HTML entity encoding middleware.
- User role cannot be set via signup — only admins can promote users.
- Password reset tokens include a `purpose` claim and are invalidated after first use via `passwordChangedAt`.
- Visa application deletion only removes auto-created, never-logged-in accounts.

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use a strong, random `JWT_SECRET` (64+ chars)
- [ ] Set `ALLOWED_ORIGINS` to your production domain(s)
- [ ] Enable HTTPS (TLS) — neveerve over plain HTTP in production
- [ ] Store uploads in S3/GCS instead of local disk
- [ ] Use a process manager (PM2) or container (Docker)
- [ ] Set up MongoDB Atlas IP allowlist
- [ ] Enable MongoDB backups
- [ ] Add centralized logging (Winston + log aggregator)
- [ ] Set up health-check monitoring (uptime alerts)
- [ ] Run `npm audit` and fix high-severity findings before deploy
- [ ] Migrate JWT storage from sessionStorage to httpOnly cookies

#admin login
email:
password:
