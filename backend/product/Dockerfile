FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .

RUN pnpm install 

COPY . .

EXPOSE 5004

CMD ["pnpm", "dev"]
