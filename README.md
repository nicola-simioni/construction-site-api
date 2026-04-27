# 🏗️ Construction Site API

A REST API for construction site management built with **Node.js**, **TypeScript**, **Fastify**, **Prisma** and **PostgreSQL**.

Built as a portfolio project to demonstrate backend development skills in the Node.js ecosystem.

## Tech Stack

- **Runtime:** Node.js 22+
- **Language:** TypeScript
- **Framework:** Fastify 4
- **ORM:** Prisma 6
- **Database:** PostgreSQL 16
- **Auth:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Containerization:** Docker + Docker Compose

## Features

- 🔐 JWT Authentication
- 👥 Role-based access control (Admin, Site Manager, Worker)
- 🏗️ Construction site management (Sites)
- 👷 Worker management
- 📋 Work log tracking with approval workflow (Pending → Approved/Rejected)

## Prerequisites

- Node.js 22+
- Docker + Docker Compose

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/construction-site-api.git
cd construction-site-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/construction_site_db"
JWT_SECRET="your_secret_key_min_16_chars"
PORT=3000
NODE_ENV=development
```

### 4. Start the database

```bash
docker compose up -d
```

### 5. Run migrations and seed

```bash
npm run db:migrate
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@construction.com | password123 |
| Site Manager | manager@construction.com | password123 |
| Worker | mario@construction.com | password123 |

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and get JWT token |

### Sites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/sites` | ✅ All | List all sites |
| GET | `/sites/:id` | ✅ All | Get site details |
| POST | `/sites` | ✅ Admin | Create a site |
| PATCH | `/sites/:id` | ✅ Admin, Manager | Update a site |
| DELETE | `/sites/:id` | ✅ Admin | Delete a site |
| POST | `/sites/:id/workers/:workerId` | ✅ Admin, Manager | Add worker to site |
| DELETE | `/sites/:id/workers/:workerId` | ✅ Admin, Manager | Remove worker from site |

### Workers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/workers` | ✅ Admin, Manager | List all workers |
| GET | `/workers/:id` | ✅ Admin, Manager | Get worker details |
| POST | `/workers` | ✅ Admin | Create a worker |
| PATCH | `/workers/:id` | ✅ Admin | Update a worker |
| DELETE | `/workers/:id` | ✅ Admin | Delete a worker |

### Work Logs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/worklogs` | ✅ All | List work logs (filter by `?siteId=` or `?workerId=`) |
| GET | `/worklogs/:id` | ✅ All | Get work log details |
| POST | `/worklogs` | ✅ Admin, Manager | Create a work log |
| PATCH | `/worklogs/:id/status` | ✅ Admin, Manager | Update work log status |
| DELETE | `/worklogs/:id` | ✅ Admin | Delete a work log |

### Health Check
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | API health check |

## Example Requests

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@construction.com", "password": "password123"}'
```

### Create a site (Admin only)
```bash
curl -X POST http://localhost:3000/sites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Cantiere Via Roma",
    "address": "Via Roma 1",
    "city": "Milano",
    "startDate": "2026-05-01T00:00:00.000Z",
    "managerId": 1
  }'
```

### Approve a work log
```bash
curl -X PATCH http://localhost:3000/worklogs/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "APPROVED"}'
```

## Project Structure

```
src/
├── config/         # Environment variables validation
├── modules/
│   ├── auth/       # Login, register
│   ├── sites/      # Construction sites CRUD
│   ├── workers/    # Workers CRUD
│   └── worklogs/   # Work logs CRUD
├── plugins/        # Fastify plugins (JWT, Prisma, Auth)
├── prisma/         # Prisma client + seed
└── types/          # TypeScript global types
prisma/
├── schema.prisma   # Database schema
└── migrations/     # SQL migrations
```

## Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma Client
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
```