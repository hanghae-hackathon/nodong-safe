import { openai } from './index.ts'
import type OpenAI from 'openai'
import { OpenaiThreadRepository } from './openai.thread.repository.ts'
import mongoose from 'mongoose'

export class OpenAiService {
  constructor(
    private readonly openAiThreadRepository: OpenaiThreadRepository,
  ) {}

  chat(
    content: string,
    model: string = 'gpt-4o-2024-05-13',
  ): Promise<OpenAI.ChatCompletion> {
    return openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model,
    })
  }

  addThreadMessage(
    threadId: string,
    params: { content: string; role: 'user' | 'assistant'; image?: Buffer },
  ) {
    return openai.beta.threads.messages.create(threadId, {
      role: params.role,
      content: params.content,
    })
  }

  createThread() {
    return openai.beta.threads.create()
  }

  saveThread(sessionId: mongoose.Types.ObjectId, threadId: string) {
    return this.openAiThreadRepository.save(sessionId, threadId)
  }

  findThreadOne(sessionId: mongoose.Types.ObjectId) {
    return this.openAiThreadRepository.findOne(sessionId)
  }

  findAssistantsAll() {
    return openai.beta.assistants.list()
  }

  findAssistantOne(
    id: string,
    list: Awaited<ReturnType<typeof openai.beta.assistants.list>>,
  ) {
    return list.data.find(assistant => assistant.id === id)
  }

  runAssistant(threadId: string, assistantId: string) {
    return openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    })
  }

  retrieveThreadRun(threadId: string, runId: string) {
    return openai.beta.threads.runs.retrieve(threadId, runId)
  }

  pollThreadRun(threadId: string, runId: string) {
    return new Promise(resolve => {
      this.retrieveThreadRun(threadId, runId).then(runObject => {
        const polling: ReturnType<typeof setInterval> = setInterval(() => {
          console.log('status:', runObject.status)
          if (runObject.status === 'completed') {
            clearInterval(polling)
            resolve(true)
          }
        }, 1000)
      })
    })
  }

  findMessagesAll(threadId: string) {
    return openai.beta.threads.messages.list(threadId)
  }
}
