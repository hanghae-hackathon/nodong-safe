import { Elysia, t } from 'elysia'
import { SessionService } from './session.service.ts'
import { SessionRepository } from './session.repository.ts'
import mongoose from 'mongoose'

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
    .model({
      sessionMsg: t.Object({
        author: t.String(),
        content: t.String(),
      }),
    })
    .decorate('Service', new SessionService(new SessionRepository()))
    .post(
      '/:session_id',
      ({ params: { session_id }, body, error, Service }) =>
        Service.updateOne(new mongoose.Types.ObjectId(session_id), {
          ...body,
          author: new mongoose.Types.ObjectId(body.author),
        }).then(r => {
          if (!r) {
            error(400, 'Bad Request')
          }
          return {
            response: 'todo',
            createdAt: r!.createdAt,
          }
        }),
      {
        body: 'sessionMsg',
      },
    )
    .post(
      '/',
      ({ body, Service }) =>
        Service.save(body).then(r => {
          return {
            session_id: r.id,
            // @todo variation
            openingMent:
              '안녕하세요. 반갑습니다! 현재 근로 계약 상황에 대해 더 자세하게 설명해주세요.',
          }
        }),
      {
        body: 'session',
      },
    )
