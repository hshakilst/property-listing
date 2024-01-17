# Tried to use Multi stage Building and Deploying Production stage where unnecessary code and modules will be removed but ec2 is very low config
# Step 1: Build the application
# FROM node:lts as builder
# Playwright Does not working on alpine image
FROM node:20-bookworm

WORKDIR /usr/src/app

# Copy backend package
COPY . .

# Install dependencies and build
RUN npm install
RUN npx -y playwright install --with-deps chromium
RUN npm run build

# Step 2: Production stage
# FROM node:20-

# WORKDIR /usr/src/app


# Copy necessary files
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/package*.json ./

# Install dependencies
# RUN npm install --prod
# RUN npx -y playwright install --with-deps

# Expose port
EXPOSE 8080

# Start the app
CMD [ "npm", "run","start:prod" ]