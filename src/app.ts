import { Elysia } from 'elysia'
import { EchoController } from './echo/echo.controller.ts'
import { connectMongo } from './infra/connect.mongo.ts'

import 'dotenv'
import staticPlugin from '@elysiajs/static'

const APP_PORT = Number(process.env.APP_PORT ?? 80)

await connectMongo(
  process.env.DB_CONNECTION_STRING as string,
  process.env.DB_NAME as string,
)

const app = new Elysia()
  .use(staticPlugin({ assets: 'dist', prefix: '/pages' }))
  .use(staticPlugin({ assets: 'public', prefix: '/public' }))
  .use(EchoController({ prefix: '/echo' }))
  .get('/', () => 'Hello Elysia')
  .listen(APP_PORT, () => {
    console.log(`App is running on http://localhost:${APP_PORT}`)
  })

export type App = typeof app
