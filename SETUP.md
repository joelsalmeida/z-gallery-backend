# Setup & Running the Application

This document explains how to configure and run the application locally using Docker Compose.

The project is composed of multiple services:

- Backend API
- Background Worker (BullMQ)
- PostgreSQL database
- Redis (queues)
- BullMQ Admin Panel

---

## Prerequisites

Make sure you have the following installed:

- Docker (v20.10+ recommended)
- Docker Compose (v2.5+)

Verify with:

```bash
docker --version
docker compose version
```

---

## Environment Variables

### Using `.env.example`

The repository includes a **`.env.example`** file with all required environment variables.

To get started:

```bash
cp .env.example .env
```

Then adjust values as needed for your local environment.

The environment variables cover:

- PostgreSQL connection
- Redis connection
- JWT authentication
- Local file storage
- Internal service configuration (API, worker, queues)

---

## Services Overview

### Backend API

- Exposes the REST API
- Handles authentication, validation, and synchronous use cases
- Publishes background jobs to Redis queues

Runs inside its own Docker container.

---

### Background Worker (BullMQ)

- Runs as a **separate container**
- Consumes jobs from Redis queues
- Handles asynchronous and long-running tasks (e.g. image processing, thumbnails)

This separation keeps the API responsive and isolates background workloads.

---

### PostgreSQL

- Primary relational database
- Runs in a dedicated container
- Data is persisted using Docker volumes

---

### Redis

- Used as the message broker for BullMQ
- Required for background job processing

Make sure Redis is running before the API and worker start (handled automatically by Docker Compose).

---

### BullMQ Panel

A web-based admin panel is included to inspect and manage queues.

It allows you to:

- View active, completed, failed, and delayed jobs
- Retry or clean up failed jobs
- Inspect job payloads and metadata

Once running, the panel is available at:

```
http://localhost:3000/admin/queues/
```

---

## Running with Docker Compose

From the project root, run:

```bash
docker compose up --build
```

This will:

- Start PostgreSQL
- Start Redis
- Build and start the Backend API
- Build and start the Background Worker
- Start the BullMQ panel

To stop all services:

```bash
docker compose down
```

To stop and remove volumes as well (⚠️ deletes database data):

```bash
docker compose down -v
```

---

## Application URLs

When running locally:

- **API**: [http://localhost:3000](http://localhost:3000)
- **Swagger UI**: [http://localhost:3000/api](http://localhost:3000/api)
- **BullMQ Panel**: [http://localhost:3000/admin/queues](http://localhost:3000/admin/queues)

---

## Authentication

The API uses **Bearer JWT authentication**.

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are issued via the authentication endpoints documented in Swagger.

---

## Scripts & Commands

Common scripts you may encounter:

### Docker / Containers

- **`docker compose up --build`** – build and start all services
- **`docker compose down`** – stop services
- **`docker compose down -v`** – stop services and remove volumes

### Application Runtime

- **`npm run start:dev`** / **`pnpm start:dev`** – run the API locally outside Docker (if supported)
- **`npm run worker`** – start the BullMQ worker process (used by the worker container)

### Storage & Maintenance Scripts

These scripts are intended for **development and maintenance** tasks and should be used with care:

- **`clean:uploads`** – removes all original uploaded files
- **`clean:thumbnails`** – removes all generated thumbnails
- **`clean:storage`** – removes **both** uploads and thumbnails

---

## Common Issues & Tips

### Redis / queue issues

- Ensure Redis is running and reachable from both API and worker containers
- If jobs are not being processed, check worker logs:

```bash
docker compose logs -f worker
```

### Database connection errors

- Ensure `DB_HOST=db` matches the database service name in `docker-compose.yml`
- Check logs:

```bash
docker compose logs -f api
```

### Port conflicts

If a port is already in use:

- Update the value in `.env`
- Update the corresponding port mapping in `docker-compose.yml`
