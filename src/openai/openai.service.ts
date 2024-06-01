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

  createThread() {
    return openai.beta.threads.create()
  }

  sendThreadMessage(
    threadId: string,
    params: { content: string; role: 'user' | 'assistant'; image?: Buffer },
  ) {
    return openai.beta.threads.messages.create(threadId, {
      role: params.role,
      content: params.content,
    })
  }

  saveThread(sessionId: mongoose.Types.ObjectId, threadId: string) {
    return this.openAiThreadRepository.save(sessionId, threadId)
  }

  findThreadOne(sessionId: mongoose.Types.ObjectId) {
    return this.openAiThreadRepository.findOne(sessionId)
  }
}
