FROM node:16-alpine As development

WORKDIR /Documents/nest-tdd

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ['node', 'dist/main.js']

EXPOSE 3000

ENTRYPOINT npm run start:dev
