## TeknoTwit

Simple Twitter-like app with posts, reposts, friendships, and DM sharing.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

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
