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

  findAssistantAll() {
    return this.openaiService.findAssistantsAll()
  }

  findAssistantOne(
    assistantId: string,
    list: Awaited<ReturnType<typeof this.findAssistantAll>>,
  ) {
    return this.openaiService.findAssistantOne(assistantId, list)
  }

  runAssistant(threadId: string, assistantId: string) {
    return this.openaiService.runAssistant(threadId, assistantId)
  }

  async addThreadMessage(
    sessionId: mongoose.Types.ObjectId,
    params: { content: string; role: 'user' | 'assistant'; image?: Buffer },
  ) {
    const threadInfo = await this.openaiService.findThreadOne(sessionId).exec()
    if (!threadInfo) return null
    return this.openaiService.addThreadMessage(threadInfo.threadId, params)
  }

  async waitAssistantRunning(threadId: string, runId: string) {
    return this.openaiService.pollThreadRun(threadId, runId)
  }

  findMessagesAll(threadId: string) {
    return this.openaiService.findMessagesAll(threadId)
  }
}
