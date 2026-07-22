# Node.js Alpine Base Image
FROM node:18-alpine

# Set Working Directory
WORKDIR /app

# Copy Package Files
COPY package*.json ./

# Install Dependencies
RUN npm ci --only=production

# Copy Source Code
COPY . .

# Expose Server Port
EXPOSE 5000

# Set Environment Variables
ENV NODE_ENV=production
ENV PORT=5000

# Start Express Server
CMD ["node", "server.js"]
