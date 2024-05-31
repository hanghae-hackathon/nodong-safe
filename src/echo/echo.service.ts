import type { EchoRepository } from './echo.repository.ts'
import type { IEcho } from './echo.entity.ts'
import * as mongoose from 'mongoose'

export class EchoService {
  constructor(private readonly echoRepository: EchoRepository) {}

  save(echo: IEcho) {
    return this.echoRepository.save(echo)
  }

  findOne(_id: mongoose.Types.ObjectId) {
    return this.echoRepository.findOne(_id)
  }
}
