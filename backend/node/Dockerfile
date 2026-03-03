FROM node:20-alpine
WORKDIR /app
COPY node/package.json ./package.json
RUN npm install
COPY node/server.js ./server.js
EXPOSE 3000
CMD ["npm", "start"]
