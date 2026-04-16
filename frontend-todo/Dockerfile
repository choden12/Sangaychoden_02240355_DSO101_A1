FROM node:18-alpine

WORKDIR /app

COPY frontend-todo/package*.json ./

RUN npm install

COPY frontend-todo/ .

EXPOSE 3000

CMD ["npm", "start"]