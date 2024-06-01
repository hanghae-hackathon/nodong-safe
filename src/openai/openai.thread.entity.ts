import * as mongoose from 'mongoose'

export interface IThread {
  _id?: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  threadId: string
}

export const ThreadSchema = new mongoose.Schema<IThread>({
  sessionId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    unique: true,
  },
  threadId: { type: String, required: true, unique: true },
})

ThreadSchema.set('toObject', {
  versionKey: false,
})

export const threadEntity = mongoose.model<IThread>('Thread', ThreadSchema)
