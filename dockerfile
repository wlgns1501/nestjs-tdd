FROM node:16-alpine As development

WORKDIR /app/nest-tdd

COPY package*.json ./

RUN npm install

COPY . .

COPY ./config/.env /app/nest-tdd/config/.env

RUN npm run build

CMD ['node']

EXPOSE 3000

ENTRYPOINT npm run deploy
