# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Build arguments
ARG VERSION=unknown
ARG BUILD_DATE
ARG GIT_COMMIT

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source code
COPY src/ ./src/

# Add labels for metadata
LABEL org.opencontainers.image.title="Quiz DevOps App" \
      org.opencontainers.image.description="Simple quiz system with DevOps pipeline" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${GIT_COMMIT}" \
      org.opencontainers.image.source="https://github.com/vimarc539/quiz_devops_apps"

# Expose port 3000
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=${VERSION}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/quiz/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "src/app.js"]

