# Use the official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development server port
EXPOSE 8080

# Command to run the development server
CMD ["npm", "run", "serve"]
