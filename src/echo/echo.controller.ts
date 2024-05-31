import { Elysia, t } from 'elysia'
import { EchoService } from './echo.service.ts'
import { EchoRepository } from './echo.repository.ts'
import * as mongoose from 'mongoose'
import { EchoView } from './echo.view.tsx'

export const EchoController = <Path extends string>(config: { prefix: Path }) =>
  new Elysia({
    name: 'echoController',
    seed: config,
  })
    .model({
      echo: t.Object({
        message: t.String(),
      }),
    })
    .decorate('Service', new EchoService(new EchoRepository()))
    .get('/echo/:_id', ({ params: { _id }, Service }) =>
      Service.findOne(new mongoose.Types.ObjectId(_id)),
    )
    .post('/echo', ({ body, Service }) => Service.save(body), {
      body: 'echo',
    })
    .get('/echo', EchoView)
