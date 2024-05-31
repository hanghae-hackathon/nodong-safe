import { Elysia } from 'elysia'
import { EchoController } from './echo/echo.controller.ts'
import { html } from '@elysiajs/html'
import { connectMongo } from './infra/connect.mongo.ts'

import 'dotenv'

const APP_PORT = Number(process.env.APP_PORT ?? 3000)

await connectMongo(
  process.env.DB_CONNECTION_STRING as string,
  process.env.DB_NAME as string,
)

new Elysia()
  .use(html())
  .use(EchoController({ prefix: '/echo' }))
  .get('/', () => 'Hello Elysia')
  .listen(APP_PORT, () => {
    console.log(`App is running on http://localhost:${APP_PORT}`)
  })
