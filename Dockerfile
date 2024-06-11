FROM node:21.6.2-alpine3.18

WORKDIR /chat

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run", "start:prod"]