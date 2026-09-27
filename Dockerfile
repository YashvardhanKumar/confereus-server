# Multi-stage build for Confereus Server & Worker

# Stage 1: Build TypeScript
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production runtime
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install curl for docker healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY keys ./keys
COPY uploads ./uploads

EXPOSE 3000

CMD ["node", "dist/index.js"]
