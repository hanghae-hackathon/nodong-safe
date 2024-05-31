FROM oven/bun:latest
WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb ./
COPY src ./src

RUN bun install

EXPOSE 80

CMD bun run start
