# Foody — MERN Snack Diary

A small full-stack CRUD app for tracking snacks: their last consumption date, favorite status, and calorie content. Built as a practice project to demonstrate a clean MERN stack with a modern React front-end and a production-ready Express API.

![screenshot](https://github.com/user-attachments/assets/bea2b5d3-d183-4138-82d9-8df4b81857e0)

## Stack

| Layer    | Tech                                                                       |
| -------- | -------------------------------------------------------------------------- |
| Frontend | React 19, TypeScript 5, Vite 6, react-bootstrap, Zustand, react-toastify   |
| Backend  | Node 20+, Express 5, Mongoose 8, helmet, rate-limiter-flexible, winston    |
| Database | MongoDB (Atlas or local)                                                   |
| Tooling  | ESLint 9 (flat config), Prettier 3, Docker, docker-compose                 |

## Project layout

```
foody-crud-mern/
├── client/          # React + Vite SPA
├── server/          # Express API
├── docker-compose.yml
└── README.md
```

## Getting started

### 1. Prerequisites

- Node.js 20 or later
- A MongoDB connection string (free tier on [MongoDB Atlas](https://www.mongodb.com/atlas/database) works fine)
- Docker (optional, only for the compose workflow)

### 2. Configure environment

At the repo root, create a `.env` from the example and fill in your MongoDB URI:

```bash
cp .env.example .env
# then edit MONGO_URI
```

For the client, optionally point it at a non-default API:

```bash
cp client/.env.example client/.env
```

### 3. Run locally (without Docker)

In two terminals:

```bash
# server
cd server
npm install
npm run dev          # http://localhost:3001

# client
cd client
npm install
npm run dev          # http://localhost:3000
```

### 4. Run with docker-compose

```bash
docker compose up --build
```

Client → http://localhost:3000, server → http://localhost:3001.

## API

Base URL: `/api/v1`

| Method | Path            | Description       |
| ------ | --------------- | ----------------- |
| GET    | `/snacks`       | List all snacks   |
| POST   | `/snacks`       | Create a snack    |
| PUT    | `/snacks/:id`   | Update a snack    |
| DELETE | `/snacks/:id`   | Delete a snack    |
| GET    | `/healthz`      | Health check      |

### Snack schema

```ts
{
  _id: string;
  name: string;
  lastDayConsumed: Date;
  isFavorite: boolean;
  calories: { value: number; unit: 'Kcal' | 'Kj' };
}
```

## Scripts

From the repo root:

| Command              | What it does                            |
| -------------------- | --------------------------------------- |
| `npm run install:all`| Install dependencies in client + server |
| `npm run lint`       | Lint both packages                      |

## License

MIT — see [LICENSE](./LICENSE) (or the `license` field in `package.json`).

## Author

[Andrea Barone](https://gitlab.com/rimssboui) · [GitHub mirror](https://github.com/reemsb/foody-crud-mern)
