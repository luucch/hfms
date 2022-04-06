FROM node:14-slim

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "run", "server"]