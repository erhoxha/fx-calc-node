# Multi-stage build for Node.js Express application
CMD ["node", "app.js"]
# Start the application

    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 || r.statusCode === 302 ? 0 : 1)})" || exit 1
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
# Health check to ensure container is running properly

EXPOSE 3000
# Expose the application port

USER nodejs
# Switch to non-root user

    chown -R nodejs:nodejs /app
    adduser -S nodejs -u 1001 && \
RUN addgroup -g 1001 -S nodejs && \
# Create a non-root user for security

COPY . .
# Copy application code

COPY --from=dependencies /app/node_modules ./node_modules
# Copy production dependencies from dependencies stage

ENV PORT=3000
ENV NODE_ENV=production
# Set Node environment to production

WORKDIR /app
# Set working directory

FROM node:18-alpine AS production
# Stage 4: Production stage

CMD ["npm", "run", "dev"]
EXPOSE 3000
COPY . .
RUN npm install
FROM base AS development
# Stage 3: Development stage (optional, for local development)

RUN npm ci --only=production --ignore-scripts
FROM base AS dependencies
# Stage 2: Install production dependencies only

COPY package*.json ./
# Copy package files

WORKDIR /app
# Set working directory

FROM node:18-alpine AS base
# Stage 1: Base image with dependencies

