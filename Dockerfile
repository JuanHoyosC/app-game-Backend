FROM node:12

ENV DEBIAN_FRONTEND=noninteractive  

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
