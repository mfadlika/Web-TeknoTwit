## TeknoTwit

Media Sosial khusus mahasiswa Teknokrat dengan fitur anonim, kirim pesan secara anonim di Time Line dan berinteraksi secara rahasia dengan sesama mahasiswa Teknokrat lainnya.

## Tech Stack

<div>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40" alt="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="40" height="40" alt="Express" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" width="40" height="40" alt="Prisma" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" height="40" alt="PostgreSQL" />
</div>

## Features

- User signup/login with JWT
- Posts and picture posts
- Repost (toggle)
- Friends (request/accept)
- DM share (send post to friends)

## Database

- PostgreSQL
- Prisma schema at `backend/prisma/schema.prisma`
- Migrations at `backend/prisma/migrations`

## Project Structure

- `frontend/` React app
- `backend/` Express + Prisma API

## Environment

Create `backend/.env`:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your_secret
```

## Setup

Backend:

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## API Highlights

- Auth: `POST /api/user/signup`, `POST /api/user/login`
- Posts: `GET /api/post`, `POST /api/post`
- Picture Post: `POST /api/post/picture`
- Repost: `POST /api/post/:id/repost`, `DELETE /api/post/:id/repost`
- Friends: `POST /api/friend/request`, `GET /api/friend`
- DM Share: `POST /api/share/dm`, `GET /api/share/dm`
