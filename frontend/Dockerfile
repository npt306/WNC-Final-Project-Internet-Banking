# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 g++ make

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files and configs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/vite.config.js ./

# Install serve globally
RUN npm install -g serve

EXPOSE 5174

# Use serve to serve the static files
CMD ["serve", "-s", "dist", "-l", "5174"]
