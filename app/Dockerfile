FROM node:8

WORKDIR /src

COPY package.json /src
COPY package-lock.json /src
RUN npm install

COPY . /src
