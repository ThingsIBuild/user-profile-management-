# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY .env .env
COPY package*.json ./
# Install only production dependencies
RUN npm ci --omit=dev
# Copy ONLY the compiled files from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Ensure this matches your actual compiled entry file (index.js)
CMD ["node", "dist/index.js"]
