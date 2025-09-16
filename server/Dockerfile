# server/Dockerfile
FROM node:22

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build arg for env (default: production)
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

EXPOSE 3001

# Default to production command (overridden by docker-compose for dev)
CMD ["node", "src/index.js"]

