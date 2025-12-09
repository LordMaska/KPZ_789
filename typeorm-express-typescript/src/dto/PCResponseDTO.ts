import { PC } from 'orm/entities/pc/PC';

export class PCResponseDTO {
  pc_id: number;
  cpu: string;
  ram: number;
  videocard: string;
  hard_disc: string;
  usb_amout: number;
  os: string;
  buy_date: string;

  constructor(entity: PC) {
    this.pc_id = entity.pc_id;
    this.cpu = entity.cpu;
    this.ram = entity.ram;
    this.videocard = entity.videocard;
    this.hard_disc = entity.hard_disc;
    this.usb_amout = entity.usb_amout;
    this.os = entity.os;
    this.buy_date = entity.buy_date;
  }
}
