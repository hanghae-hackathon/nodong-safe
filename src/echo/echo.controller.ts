import { Elysia, t } from 'elysia'
import { EchoService } from './echo.service.ts'
import { EchoRepository } from './echo.repository.ts'
import * as mongoose from 'mongoose'
import { EchoView } from './echo.view.tsx'
import { OpenAiService } from '../infra/openai.service.ts'
import { OpenapiView } from '../infra/openapi.view.tsx'

export const EchoController = <Path extends string>(config: { prefix: Path }) =>
  new Elysia({
    name: 'echoController',
    prefix: config.prefix,
  })
    .model({
      echo: t.Object({
        message: t.String(),
      }),
    })
    .model({
      openai: t.Object({
        chat: t.String(),
      }),
    })
    .decorate('EchoService', new EchoService(new EchoRepository()))
    .decorate('OpenAiService', new OpenAiService())
    .post(
      '/openai',
      ({ body, OpenAiService }) =>
        OpenAiService.chat(body.chat).then(completion =>
          OpenapiView({
            response:
              completion?.choices.at(0)?.message.content ?? '응답이 없습니다.',
          }),
        ),
      {
        body: 'openai',
      },
    )
    .get('/openai', OpenapiView())
    .get('/:_id', ({ params: { _id }, EchoService }) =>
      EchoService.findOne(new mongoose.Types.ObjectId(_id)),
    )
    .post('/', ({ body, EchoService }) => EchoService.save(body), {
      body: 'echo',
    })
    .get('/', EchoView())
