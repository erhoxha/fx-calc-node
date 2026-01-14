# Use official Node.js LTS image
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
FROM base AS dependencies
RUN npm ci --only=production

# Production stage
FROM base AS production

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Use PORT env variable (Fly.io provides this)
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
