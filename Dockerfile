FROM node:lts-alpine

ENV NODE_ENV=${NODE_ENV}

RUN npm install -g pnpm

WORKDIR /app

# Setup dependencies and envs
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .env.${NODE_ENV} ./.env.${NODE_ENV}

# Copy source code
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build source code
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the app
CMD [ "pnpm", "start" ]