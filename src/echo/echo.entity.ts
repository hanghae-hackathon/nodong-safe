import * as mongoose from 'mongoose'

export interface IEcho {
  _id?: mongoose.Types.ObjectId
  message: string
}

export const EchoSchema = new mongoose.Schema<IEcho>({
  message: { type: String, required: true },
})

export const EchoEntity = mongoose.model<IEcho>('Echo', EchoSchema)

EchoSchema.set('toObject', { versionKey: false })
