# Setup & Running the Application

## Prerequisites

- Docker
- Docker Compose

---

## Environment Variables

Create a `.env` file using the following example:

```env
# POSTGRES DATABASE

POSTGRES_USER="z-gallery-db-superuser"
POSTGRES_PASSWORD="qoGcsr4Wfu47rG3DPEdOfB3jKr8R8cw8"
POSTGRES_DB="z-gallery"
POSTGRES_PORT=5432
DATABASE_URL="postgresql://z-gallery-db-superuser:qoGcsr4Wfu47rG3DPEdOfB3jKr8R8cw8@db:5432/z-gallery?schema=public"

# BACKEND APPPLICATION

PORT=3000
JWT_SECRET="88af7449a8a9a91dd13339e3bf2f43e795dba781db2e377724259e1f1f8a974f"
JWT_ACCESS_EXPIRATION_IN="60s"
JWT_REFRESH_EXPIRATION_IN="160s"
PHOTO_STORAGE_PATH="./uploads"

# WAIT-FOR-DB SCRIPT

DB_HOST=db
DB_PORT=5432
```

## Running with Docker Compose

`docker compose up --build`

The API will be available at:

http://localhost:3000

API Documentation (Swagger)

Swagger UI is available at:

http://localhost:3000/api

Authentication uses Bearer JWT:

Authorization: Bearer <access_token>
