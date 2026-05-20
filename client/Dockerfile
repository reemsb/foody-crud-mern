# syntax=docker/dockerfile:1
ARG NODE_ENV=production

# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# --- Runtime stage ---
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve@14
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
