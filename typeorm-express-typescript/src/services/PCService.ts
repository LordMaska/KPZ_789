import { getRepository } from 'typeorm';

import { PC } from 'orm/entities/pc/PC';
import { CustomError } from 'utils/response/custom-error/CustomError';

export class PCService {
  private pcRepository = getRepository(PC);

  async findAll() {
    return this.pcRepository.find();
  }

  async findOne(id: number | string) {
    const pc = await this.pcRepository.findOne(id as any);
    if (!pc) {
      throw new CustomError(404, 'General', `PC with id:${id} not found.`, ['PC not found.']);
    }
    return pc;
  }

  async create(data: Partial<PC>) {
    const pc = this.pcRepository.create(data as PC);
    await this.pcRepository.save(pc);
    return pc;
  }

  async update(id: number | string, data: Partial<PC>) {
    const pc = await this.findOne(id);
    Object.assign(pc, data);
    await this.pcRepository.save(pc);
    return pc;
  }

  async delete(id: number | string) {
    const pc = await this.findOne(id);
    await this.pcRepository.delete(id as any);
    return pc;
  }
}
