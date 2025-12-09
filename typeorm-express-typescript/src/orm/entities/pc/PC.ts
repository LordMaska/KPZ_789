import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Session } from '../session/Session';

@Entity('pc')
export class PC {
  @PrimaryGeneratedColumn()
  pc_id: number;

  @Column({ length: 120 })
  cpu: string;

  @Column()
  ram: number;

  @Column({ length: 120 })
  videocard: string;

  @Column({ length: 30 })
  hard_disc: string;

  @Column()
  usb_amout: number;

  @Column({ length: 50 })
  os: string;

  @Column('date')
  buy_date: string;

  @OneToMany(() => Session, (s) => s.pc)
  sessions: Session[];
}
