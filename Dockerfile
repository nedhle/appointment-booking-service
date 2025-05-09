# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install system dependencies and create non-root user
RUN apk add --no-cache bash postgresql-client && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# Copy package files and prisma schema
COPY --chown=appuser:appgroup package*.json ./ 
COPY --chown=appuser:appgroup prisma ./prisma/
COPY --chown=appuser:appgroup . .

# Install dependencies
RUN npm ci

# Generate Prisma client and build
RUN npx prisma generate && \
    npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install runtime dependencies
RUN apk add --no-cache bash postgresql-client

# Copy compiled files and node_modules from build stage
COPY --from=builder /usr/src/app /usr/src/app

# Expose port
EXPOSE 3000

# Set env vars
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/appointment_db" \
    PORT=3000 \
    NODE_ENV=production

# Wait for DB and run app
CMD sh -c '\
  echo "Starting app..."; \
  until pg_isready -h db -p 5432 -U postgres; do \
    echo "Waiting for DB..."; \
    sleep 2; \
  done; \
  npx prisma generate && \
  npx prisma migrate deploy && \
  npm run start:prod \
'
