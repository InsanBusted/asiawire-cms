# ===============================
# ---- BUILD STAGE --------------
# ===============================
FROM node:20-bullseye-slim AS build

WORKDIR /app

# Install build dependencies (sharp + mime support)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libvips-dev \
    file \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build Strapi (v5 + TypeScript)
RUN npm run build


# ===============================
# ---- RUNTIME STAGE ------------
# ===============================
FROM node:20-bullseye-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies only
RUN apt-get update && apt-get install -y \
    libvips \
    file \
    && rm -rf /var/lib/apt/lists/*

# Install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built app from build stage
COPY --from=build /app ./

# Expose Strapi port
EXPOSE 1337

# Healthcheck (optional but recommended)
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:1337/_health || exit 1

CMD ["npm", "run", "start"]
