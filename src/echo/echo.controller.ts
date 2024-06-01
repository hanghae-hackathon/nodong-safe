import { Elysia, t } from 'elysia'
import { EchoService } from './echo.service.ts'
import { EchoRepository } from './echo.repository.ts'
import * as mongoose from 'mongoose'
import { OpenAiService } from '../openai/openai.service.ts'
import { OpenaiThreadRepository } from '../openai/openai.thread.repository.ts'

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
    .decorate('OpenAiService', new OpenAiService(new OpenaiThreadRepository()))
    .post(
      '/openai',
      ({ body, OpenAiService }) => OpenAiService.chat(body.chat),
      {
        body: 'openai',
      },
    )
    .get('/:_id', ({ params: { _id }, EchoService }) =>
      EchoService.findOne(new mongoose.Types.ObjectId(_id)),
    )
    .post('/', ({ body, EchoService }) => EchoService.save(body), {
      body: 'echo',
    })
