# Use lightweight Alpine base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
