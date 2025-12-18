# Stage 1: Build the React frontend
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the Node.js server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY server.js ./
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server.js"]
