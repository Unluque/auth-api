# Use an official Node.js runtime as a parent image
FROM node:lts

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies (use npm ci for reproducibility)
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port
ARG PORT=5000
ENV PORT=$PORT
EXPOSE $PORT

# Start the app
CMD ["npm", "start"]
