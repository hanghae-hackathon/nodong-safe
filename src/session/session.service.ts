import type { SessionRepository } from './session.repository.ts'
import * as mongoose from 'mongoose'
import type { PartialChat, PartialSession } from './session.entity.ts'

export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  save(session: PartialSession) {
    return this.sessionRepository.save(session)
  }

  updateOne(_id: mongoose.Types.ObjectId, body: PartialChat) {
    return this.sessionRepository.updateOne(_id, body)
  }
}
