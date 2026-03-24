# Debian-based image: Prisma engines need glibc + OpenSSL 3 (Alpine/musl + libssl1.1 breaks at runtime)
FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc* ./

RUN pnpm install

COPY . .

RUN pnpm exec prisma generate --schema=./prisma/schema.prisma

ENV PORT=3005
EXPOSE 3005

CMD ["pnpm", "dev"]
