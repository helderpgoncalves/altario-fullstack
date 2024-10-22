# Use a more recent Node.js version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
# Use npm install instead of npm ci, and create a package-lock.json if it doesn't exist
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port (we'll override this in docker-compose.yml)
EXPOSE 3000

# Start the application (we'll override this in docker-compose.yml)
CMD ["npm", "start"]
