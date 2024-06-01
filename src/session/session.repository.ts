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
      ...session,
      image: imageBuffer,
    }).save()
  }

  updateOne(_id: mongoose.Types.ObjectId, body: PartialChat) {
    return SessionEntity.findOneAndUpdate(
      { _id },
      { conversations: { $push: body } },
      { new: true },
    )
  }

  private async blobToBuffer(blob: Blob): Promise<Buffer> {
    const arrayBuffer = await blob.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}
