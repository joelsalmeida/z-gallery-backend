#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."

until pg_isready -h "$DB_HOST" -p "$POSTGRES_PORT"; do
  sleep 1
done

echo "✅ PostgreSQL is ready"
