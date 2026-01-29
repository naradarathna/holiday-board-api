# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy dependencies, built application and prisma schema from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy and set up the entrypoint script
COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh

# Expose the application port (NestJS default is 3000)
EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["./entrypoint.sh"]

# Command to run the application
CMD ["node", "dist/main.js"]