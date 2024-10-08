FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
# Build the app for production
RUN npm run build

# Install a simple HTTP server to serve the built files
RUN npm install -g serve

# Expose the port on which the frontend app will run
EXPOSE 8080

# Command to run the server
CMD ["serve", "-s", "dist", "-l", "8080"]