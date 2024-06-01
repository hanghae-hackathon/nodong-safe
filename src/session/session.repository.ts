import {
  type PartialChat,
  type PartialSession,
  SessionEntity,
} from './session.entity.ts'
import * as mongoose from 'mongoose'

export class SessionRepository {
  async save(session: PartialSession) {
    const imageBuffer = await this.blobToBuffer(session.image)
    return new SessionEntity({
      image: imageBuffer,
      createdAt: new Date(),
    }).save()
  }

  updateOne(_id: mongoose.Types.ObjectId, body: PartialChat) {
    return SessionEntity.updateOne(
      { _id },
      { conversations: { $push: { ...body, createdAt: new Date() } } },
    )
  }

  private async blobToBuffer(blob: Blob): Promise<Buffer> {
    const arrayBuffer = await blob.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}
