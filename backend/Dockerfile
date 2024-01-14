# Step 1: Build the application
FROM node:lts as builder

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy entire workspace
COPY . .

# Change to the specific package directory
WORKDIR /usr/src/app/backend

# Install dependencies and build
RUN pnpm install
RUN pnpm build

# Step 2: Production stage
FROM node:lts-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

# Copy necessary files
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./

# Install dependencies
RUN pnpm install --prod
RUN pnpx playwright install --with-deps chromium

# Expose port
EXPOSE 8080

# Start the app
CMD [ "pnpm", "start:prod" ]