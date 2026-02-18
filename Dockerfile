# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache file vips-dev

# deps
COPY package*.json ./
RUN npm ci

# source
COPY . .

# build (Strapi v5 + TS)
RUN npm run build

# ---- runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy built app
COPY --from=build /app ./

EXPOSE 1337
CMD ["npm", "run", "start"]
