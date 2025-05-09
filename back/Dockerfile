FROM node:18-alpine
WORKDIR /usr/src/app/back
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV PORT 5000
CMD [ "node", "server.js" ]