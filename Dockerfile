FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run compile
EXPOSE 4020
CMD ["npm", "run", "dev"]
