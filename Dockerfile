FROM node:18.13.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
