import { Elysia, t } from 'elysia'
import { SessionService } from './session.service.ts'
import { SessionRepository } from './session.repository.ts'
// import mongoose from 'mongoose'

export const SessionController = <Path extends string>(config: {
  prefix: Path
}) =>
  new Elysia({
    name: 'sessionController',
    prefix: config.prefix,
  })
    .model({
      session: t.Object({
        image: t.File(),
      }),
    })
    // .model({
    //   sessionMsg: t.Object({
    //     author: t.String(),
    //     content: t.String(),
    //   }),
    // })
    .decorate('Service', new SessionService(new SessionRepository()))
    // .post(
    //   '/:session_id',
    //   ({ params: { session_id }, body, Service }) => {
    //     Service.updateOne(new mongoose.Types.ObjectId(session_id), {
    //       ...body,
    //       author: new mongoose.Types.ObjectId(body.author),
    //     })
    //     return // ...
    //   },
    //   {
    //     body: 'sessionMsg',
    //   },
    // )
    .post(
      '/',
      ({ body, Service }) => {
        Service.save(body)
        return // 201, msg
      },
      {
        body: 'session',
      },
    )
