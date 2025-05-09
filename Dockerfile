# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache bash postgresql-client

# Copy only package files and prisma
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Generate Prisma client and build
RUN npx prisma generate && npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache bash postgresql-client

# Copy only what's needed from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/appointment_db"

# Run app
CMD ["node", "dist/main"]
