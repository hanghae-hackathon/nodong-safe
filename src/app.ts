import { Elysia } from 'elysia'
import { EchoController } from './echo/echo.controller.ts'
import { html } from '@elysiajs/html'

import 'dotenv'
import { connectMongo } from './infra/connect.mongo.ts'
import node from '@elysiajs/node'

const APP_PORT = Number(process.env.APP_PORT ?? 3000)

await connectMongo(
  process.env.DB_CONNECTION_STRING as string,
  process.env.DB_NAME as string,
)

const app = new Elysia()
  .use(html())
  .use(EchoController({ prefix: '/echo' }))
  .get('/', () => 'Hello Elysia')

if (process.env.RUNTIME === 'node') {
  app.use(node(APP_PORT))
} else {
  app.listen(APP_PORT, () => {
    console.log(`App is running on http://localhost:${APP_PORT}`)
  })
}
