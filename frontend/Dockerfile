FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "pnpm install && pnpm dev -- --hostname 0.0.0.0 --port 3000"]
