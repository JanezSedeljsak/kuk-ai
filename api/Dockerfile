FROM oven/bun:1.2.18-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]