#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."

# Use the DB_HOST and DB_PORT from .env
until pg_isready -h "$DB_HOST" -p "$DB_PORT"; do
  sleep 1
done

echo "✅ PostgreSQL is ready"
