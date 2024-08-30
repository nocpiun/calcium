FROM node:20-bullseye

COPY . /calcium/
WORKDIR /calcium/

RUN npm i

EXPOSE 3000

ENTRYPOINT npm run docker:start
