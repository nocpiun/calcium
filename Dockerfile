FROM node:16-alpine

COPY . /calcium/
WORKDIR /calcium/

RUN npm i

EXPOSE 3000

ENTRYPOINT npm run start
