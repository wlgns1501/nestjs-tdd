FROM node:16-alpine As development

WORKDIR /app/nest-tdd

COPY package*.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

COPY ./config/.env /app/nest-tdd/config/.env

RUN npm run build

CMD ['node', 'main.js']

EXPOSE 3000

ENTRYPOINT npm run deploy
