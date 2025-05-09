#!/bin/sh
set -e

echo "Starting application..."

# Wait for database to be ready
until pg_isready -h db -p 5432 -U postgres; do
  echo "Waiting for database connection..."
  sleep 2
done

# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate deploy

# Start the application
exec npm run start:prod
