FROM node:18

WORKDIR /src/start

COPY package*.json ./

RUN npm install

COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "start-dev"]