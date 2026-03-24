# Use Debian-based image to avoid OpenSSL issues
FROM node:18-bullseye

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json pnpm-lock.yaml* .npmrc* ./

RUN pnpm install

# Copy the rest of the source code
COPY . .

# Build the project (runs prisma generate + tsc)
RUN pnpm build

# Environment variables
ENV PORT=3003
EXPOSE 3003

# Run migrations before starting the app
CMD pnpm db:migrate && pnpm dev
