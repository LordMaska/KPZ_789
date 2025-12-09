import { getRepository } from 'typeorm';

import { Client } from 'orm/entities/client/Client';
import { CustomError } from 'utils/response/custom-error/CustomError';

export class ClientService {
  private clientRepository = getRepository(Client);

  async findAll() {
    return this.clientRepository.find({ relations: ['sessions'] });
  }

  async findOne(phone: string) {
    const client = await this.clientRepository.findOne(phone, { relations: ['sessions'] });
    if (!client) {
      throw new CustomError(404, 'General', `Client with phone:${phone} not found.`, ['Client not found.']);
    }
    return client;
  }

  async create(data: Partial<Client>) {
    const client = this.clientRepository.create(data as Client);
    await this.clientRepository.save(client);
    return this.findOne(client.phone);
  }

  async update(phone: string, data: Partial<Client>) {
    const client = await this.findOne(phone);
    Object.assign(client, data);
    await this.clientRepository.save(client);
    return client;
  }

  async delete(phone: string) {
    const client = await this.findOne(phone);
    await this.clientRepository.delete(phone as any);
    return client;
  }
}
