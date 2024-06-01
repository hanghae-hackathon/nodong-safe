import type { SessionRepository } from './session.repository.ts'
import * as mongoose from 'mongoose'
import type { PartialChat, PartialSession } from './session.entity.ts'
import { OpenAiService } from '../openai/openai.service.ts'

export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly openaiService: OpenAiService,
  ) {}

  save(session: PartialSession) {
    return this.sessionRepository.save(session)
  }

  updateOne(_id: mongoose.Types.ObjectId, body: PartialChat) {
    return this.sessionRepository.updateOne(_id, body)
  }

  async createThread(sessionId: mongoose.Types.ObjectId) {
    const thread = await this.openaiService.createThread()
    return this.openaiService.saveThread(sessionId, thread.id)
  }

  async sendThreadMessage(
    sessionId: mongoose.Types.ObjectId,
    params: { content: string; role: 'user' | 'assistant'; image?: Buffer },
  ) {
    const threadInfo = await this.openaiService.findThreadOne(sessionId).exec()
    if (!threadInfo) return null
    return this.openaiService.sendThreadMessage(threadInfo.threadId, params)
  }

  sendMessage(content: string) {
    return this.openaiService.chat(content, 'asst_hWVrfYW3ro1AssJVX8StKgqZ')
  }
}
