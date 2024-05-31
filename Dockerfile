FROM oven/bun:latest
WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb ./
COPY src ./src

RUN bun install

EXPOSE 3000

CMD bun run start
