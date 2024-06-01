import { threadEntity } from './openai.thread.entity.ts'
import mongoose from 'mongoose'

export class OpenaiThreadRepository {
  save(sessionId: mongoose.Types.ObjectId, threadId: string) {
    return new threadEntity({
      sessionId,
      threadId,
    }).save()
  }

  findOne(sessionId: mongoose.Types.ObjectId) {
    return threadEntity.findOne({ sessionId })
  }
}
