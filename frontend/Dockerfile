FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install

COPY . .
RUN pnpm run build

ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]
