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

          // const message = await Service.sendMessage(body.content)
          return {
            response: '',
            createdAt: r!.createdAt,
          }
        }),
      {
        body: 'sessionMsg',
      },
    )
    .post(
      '/',
      async ({ body, error, Service }) =>
        Service.save(body).then(async r => {
          console.log('create thread')

          const thread = await Service.createThread(r._id)
          await Service.addThreadMessage(r._id, {
            role: 'user',
            content: `
            1. Introduce yourself as an AI and greet warmly.
            2. Carefully categorize the contents of the employment contract or related documents uploaded by the user.
            3. Thoroughly categorize the concerns contained in the text sent by the user.
            4. Mention which articles of labor law correspond to the categorized contents.
            5. Check if there are any violations of the legal provisions.
            6. If any violations are found, provide advice.
            7. Speak in korean.
            `.trim(),
          })

          console.log('list assistants')

          const list = await Service.findAssistantAll()
          const assistant = Service.findAssistantOne(
            'asst_ndxhvEliIE6nHhfV26EKmEdR',
            list,
          )

          if (!assistant) {
            return error(400, 'Invalid Assistant')
          }

          console.log('run assistant', assistant.id)

          const run = await Service.runAssistant(thread.threadId, assistant.id)

          console.log('wait assistant', thread.threadId, run.id)

          await Service.waitAssistantRunning(thread.threadId, run.id)

          console.log('list message')

          const messagePage = await Service.findMessagesAll(thread.threadId)

          const openingMent: string[] = []
          messagePage.data.forEach(message => {
            console.log('got message', message.content)
            openingMent.push(message.content.join(''))
          })

          console.log('job done')

          return {
            session_id: r.id,
            openingMent: openingMent.join(''),
          }
        }),
      {
        body: 'session',
      },
    )
