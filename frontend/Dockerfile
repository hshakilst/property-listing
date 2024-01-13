# Step 1: Build the application
FROM node:lts as builder

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy entire workspace
COPY . .

# Change to the specific package directory
WORKDIR /usr/src/app/frontend

# Install dependencies and build
RUN pnpm install
RUN pnpm build

# Step 2: Production stage
FROM node:lts-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

# Copy necessary files
COPY --from=builder /usr/src/app/frontend/.next ./.next
COPY --from=builder /usr/src/app/frontend/package.json ./

RUN pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "start:prod"]
