FROM node:8

WORKDIR /src

RUN npm install pm2 -g

COPY package.json /src
COPY package-lock.json /src
RUN npm install

COPY . /src
