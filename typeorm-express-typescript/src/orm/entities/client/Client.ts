import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from 'typeorm';

import { Session } from '../session/Session';

@Entity('client')
export class Client {
  @PrimaryColumn({
    length: 15,
  })
  phone: string;

  @Column({ length: 155 })
  full_name: string;

  @Column('date')
  birth: string;

  @OneToMany(() => Session, (s) => s.client)
  sessions: Session[];
}
