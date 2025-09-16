# client/Dockerfile
FROM node:22 as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build arg for env (default: production)
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# In production: build static files
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# -------------------
# Production stage
FROM node:22-slim as production

WORKDIR /app

# Copy built app from previous stage
COPY --from=build /app/build ./build

# Install serve for static hosting
RUN npm install -g serve

EXPOSE 80

# Default: serve static build (overridden by docker-compose for dev)
CMD ["serve", "-s", "build", "-l", "80"]
