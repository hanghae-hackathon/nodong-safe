import { Elysia, t } from 'elysia'
import { SessionService } from './session.service.ts'
import { SessionRepository } from './session.repository.ts'
import mongoose from 'mongoose'
import { OpenAiService } from '../openai/openai.service.ts'
import { OpenaiThreadRepository } from '../openai/openai.thread.repository.ts'

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
    .decorate(
      'Service',
      new SessionService(
        new SessionRepository(),
        new OpenAiService(new OpenaiThreadRepository()),
      ),
    )
    .post(
      '/:session_id',
      ({ params: { session_id }, body, error, Service }) =>
        Service.updateOne(new mongoose.Types.ObjectId(session_id), {
          ...body,
          author: new mongoose.Types.ObjectId(body.author),
        }).then(async r => {
          if (!r) {
            return error(400, 'Bad Request')
          }

          const message = await Service.sendMessage(body.content)
          return {
            response: message.choices.at(0)?.message ?? '',
            createdAt: r!.createdAt,
          }
        }),
      {
        body: 'sessionMsg',
      },
    )
    .post(
      '/',
      async ({ body, Service }) =>
        Service.save(body).then(async r => {
          const message = await Service.sendMessage(
            `
            1. Introduce yourself as an AI and greet warmly.
            2. Carefully categorize the contents of the employment contract or related documents uploaded by the user.
            3. Thoroughly categorize the concerns contained in the text sent by the user.
            4. Mention which articles of labor law correspond to the categorized contents.
            5. Check if there are any violations of the legal provisions.
            6. If any violations are found, provide advice.
            7. Speak in korean.
            `.trim(),
          )

          return {
            session_id: r.id,
            openingMent: message.choices.at(0)?.message ?? '',
          }
        }),
      {
        body: 'session',
      },
    )
