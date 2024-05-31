import { EchoEntity, type IEcho } from './echo.entity.ts'
import * as mongoose from 'mongoose'

export class EchoRepository {
  save(echo: IEcho) {
    return new EchoEntity(echo).save()
  }

  findOne(_id: mongoose.Types.ObjectId) {
    return EchoEntity.findOne({ _id })
  }
}
