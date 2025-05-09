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

# Create entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose application port
EXPOSE 3000

# Set default environment variables
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/appointment_db" \
    PORT=3000 \
    NODE_ENV=production

# Use the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command
CMD ["npm", "run", "start:prod"]