FROM node:20-alpine

WORKDIR /app

ADD . .

RUN npm ci --omit=dev

EXPOSE 4000

CMD ["sh", "-c", "npm run db:seed && npm run start"]