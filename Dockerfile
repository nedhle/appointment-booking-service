# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache bash postgresql-client

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate && \
    npm run build

# --- Production Runtime Stage ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Install runtime dependencies
RUN apk add --no-cache bash postgresql-client

# Copy built app, dependencies and necessary files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY prisma ./prisma


# Expose app port
EXPOSE 3000

# Set environment variables
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/appointment_db" \
    PORT=3000 \
    NODE_ENV=production

CMD sh -c '\
  echo "Waiting for DB..."; \
  until pg_isready -h db -p 5432 -U postgres; do sleep 2; done; \
  echo "DB ready, running migrations..."; \
  npx prisma generate && \
  npx prisma migrate deploy && \
  echo "Starting app..."; \
  npm run start:prod \
'

