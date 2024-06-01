import * as mongoose from 'mongoose'

export interface ISession {
  _id?: mongoose.Types.ObjectId
  image: Blob
  conversations: IChat[]
  createdAt: Date
}

export interface IChat {
  author: mongoose.Types.ObjectId
  content: string
  createdAt: Date
}

export type PartialSession = Partial<ISession> & { image: Blob }
export type PartialChat = Partial<IChat>

export const ChatSchema = new mongoose.Schema<IChat>(
  {
    author: { type: mongoose.SchemaTypes.ObjectId, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true },
  },
)

ChatSchema.set('toObject', { versionKey: false })

export const SessionSchema = new mongoose.Schema<ISession>(
  {
    conversations: { type: [ChatSchema], required: true },
    image: { type: Buffer, required: true },
  },
  { timestamps: { createdAt: true } },
)

SessionSchema.set('toObject', {
  versionKey: false,
  transform: (_, ret) => {
    const { image, ...rest } = ret
    return rest
  },
})

export const SessionEntity = mongoose.model<ISession>('Session', SessionSchema)

SessionSchema.set('toObject', { versionKey: false })
