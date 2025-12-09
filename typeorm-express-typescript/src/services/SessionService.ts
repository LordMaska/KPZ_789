import { getRepository } from 'typeorm';

import { Session } from 'orm/entities/session/Session';
import { CustomError } from 'utils/response/custom-error/CustomError';

export class SessionService {
  private sessionRepository = getRepository(Session);

  async findAll() {
    return this.sessionRepository.find({ relations: ['pc', 'client'] });
  }

  async findOne(id: number | string) {
    const session = await this.sessionRepository.findOne(id as any, { relations: ['pc', 'client'] });
    if (!session) {
      throw new CustomError(404, 'General', `Session with id:${id} not found.`, ['Session not found.']);
    }
    return session;
  }

  async create(data: Partial<Session>) {
    const session = this.sessionRepository.create(data as Session);
    await this.sessionRepository.save(session);
    return this.findOne(session.session_id);
  }

  async update(id: number | string, data: Partial<Session>) {
    const session = await this.findOne(id);
    Object.assign(session, data);
    await this.sessionRepository.save(session);
    return session;
  }

  async delete(id: number | string) {
    const session = await this.findOne(id);
    await this.sessionRepository.delete(id as any);
    return session;
  }
}
