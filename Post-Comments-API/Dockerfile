# Use an official Node.js runtime as a parent image
FROM node:18.18-alpine3.17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port your application will run on
EXPOSE 3003

# Define the command to start your Node.js application
CMD [ "node", "app.js" ]
