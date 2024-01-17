# Tried to use Multi stage Building and Deploying Production stage where unnecessary code and modules will be removed but ec2 is very low config
# Step 1: Build the application
# FROM node:lts as builder
FROM node:lts-alpine

WORKDIR /usr/src/app

# Copy frontend package
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build

# Step 2: Production stage
# FROM node:lts-alpine

# WORKDIR /usr/src/app

# Copy necessary files
# COPY --from=builder /usr/src/app/.next ./.next
# COPY --from=builder /usr/src/app/package*.json ./

# RUN npm install --prod

EXPOSE 3000

CMD ["npm", "run","start:prod"]
