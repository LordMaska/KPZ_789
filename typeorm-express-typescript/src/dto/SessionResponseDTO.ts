import { Session } from 'orm/entities/session/Session';

import { PCResponseDTO } from './PCResponseDTO';

export class SessionResponseDTO {
  session_id: number;
  pc_id: number;
  client_phone: string;
  Time: string;
  Duration: string;
  Cost: number;
  pc?: PCResponseDTO;

  constructor(entity: Session) {
    this.session_id = entity.session_id;
    this.pc_id = entity.pc_id;
    this.client_phone = entity.client_phone;
    this.Time = entity.Time;
    this.Duration = entity.Duration;
    this.Cost = entity.Cost;
    if (entity.pc) {
      this.pc = new PCResponseDTO(entity.pc);
    }
  }
}
