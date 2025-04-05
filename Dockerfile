# Use official Node.js image as a base
FROM node:18-alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the root folder to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire src folder into the container
COPY src/ ./src

# Expose the port that the app will run on
EXPOSE 3000

# Start the application (run node src/server.js)
CMD ["node", "src/server.js"]
