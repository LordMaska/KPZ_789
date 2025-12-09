import { Client } from 'orm/entities/client/Client';

export class ClientResponseDTO {
  phone: string;
  full_name: string;
  birth: string;
  sessions?: Array<{ session_id: number; Time: string; Duration: string; Cost: number; pc_id: number }>;

  constructor(entity: Client) {
    this.phone = entity.phone;
    this.full_name = entity.full_name;
    this.birth = entity.birth;
    if (entity.sessions && Array.isArray(entity.sessions)) {
      this.sessions = entity.sessions.map((s) => ({
        session_id: s.session_id,
        Time: s.Time,
        Duration: s.Duration,
        Cost: s.Cost,
        pc_id: s.pc_id,
      }));
    }
  }
}
