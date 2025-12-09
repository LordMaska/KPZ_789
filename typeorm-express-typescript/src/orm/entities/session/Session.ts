import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

import { Client } from '../client/Client';
import { PC } from '../pc/PC';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  session_id: number;

  @Column()
  pc_id: number;

  @Column({ length: 15 })
  client_phone: string;

  @Column('timestamp')
  Time: string;

  @Column('interval')
  Duration: string;

  @Column('money')
  Cost: number;

  @ManyToOne(() => PC, (c) => c.sessions)
  @JoinColumn({ name: 'pc_id' })
  pc: PC;

  @ManyToOne(() => Client, (c) => c.sessions)
  @JoinColumn({ name: 'client_phone' })
  client: Client;
}
