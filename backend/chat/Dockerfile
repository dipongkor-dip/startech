FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .

RUN pnpm install

COPY . .

EXPOSE 3006

CMD ["pnpm", "dev"]
