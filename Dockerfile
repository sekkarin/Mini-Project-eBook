FROM node:21-alpine3.18
WORKDIR /usr/src/app

COPY package.json .

EXPOSE 3000
RUN npm install cross-env
RUN npm install --omit=dev
COPY . .

CMD [ "npm","run","start:dev" ]