
FROM node:16.3.0
ENV TZ=Europe/Paris

WORKDIR /app

COPY package*.json /app/
RUN npm install
COPY ./ /app/

CMD node -r ./src/reminder-bot.js
