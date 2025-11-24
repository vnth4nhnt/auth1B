# multi-stage Dockerfile
# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker#step-3-writing-the-dockerfile
# Build stage
# FROM node:20-alpine AS builder
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json .

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code 
COPY . .

# Production stage
# FROM node: 20-alpine AS production

# Create app directory
# WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy build application from builder stage
# COPY --from=builder --chown=nextjs:nodejs /app /app

# Switch to non-root user
USER appuser

# Expose port
Expose 8080

# Add health check
# HEALTHCHECK --interval =30s --timeout=3s --start-period=5s --retries=3 \
#     CMD node -e "require('http').get('http://localhost:8080', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "run", "dev"]