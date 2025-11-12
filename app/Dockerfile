# # app/Dockerfile
# FROM node:22-alpine AS builder

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# COPY . .
# RUN yarn build

# # Production image
# FROM node:22-alpine AS production
# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./
# RUN yarn install --production --frozen-lockfile

# COPY --from=builder /usr/src/app/dist ./dist

# EXPOSE 3001
# CMD ["node", "dist/main"]



# Stage 1 — Build the app
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency files first (to leverage Docker cache)
COPY package.json yarn.lock ./

# Install all dependencies (including dev)
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN yarn build

# Prune dev dependencies (keep only production)
RUN yarn install --frozen-lockfile --production=true

# Stage 2 — Production image
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Copy production node_modules and build output
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json yarn.lock ./

# Expose port (NestJS defaults to 3000)
EXPOSE 3001

# Create and switch to non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the app
CMD ["node", "dist/main.js"]

