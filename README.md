# Boy Scouts Item Catalogue — Prototype

This repository contains a runnable prototype for the Boy Scouts Item Catalogue. It is a minimal scaffold to get started and should be treated as a prototype.

Run locally (requires Docker & Docker Compose):

1. Copy the env example for backend:
   cd backend
   cp .env.example .env

2. Start services:
   docker-compose up --build

3. After Postgres is ready, generate prisma client and run seed (from host in backend):
   cd backend
   npx prisma generate
   node prisma/seed.js

4. Open frontend at http://localhost:5173
   Backend API at http://localhost:4000

Default dev admin access code: devcode

Notes:
- This is a minimal prototype. Important security and production hardening are required before using this in production.
- Discord webhook configuration and secure access-code hashing will be implemented in later iterations.
