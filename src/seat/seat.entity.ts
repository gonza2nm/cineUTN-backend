import { Cascade, Collection, DateTimeType, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { User } from '../user/user.entity.js';
import { Ticket } from '../ticket/ticket.entity.js';
import { Show } from '../show/show.entity.js';


@Entity()
export class Seat extends BaseEntity {

  @Property({ nullable: true })
  seatNumber!: string;

  @Property({ nullable: false })
  status!: string;

  //Relacion con la entidad show
  @ManyToOne(() => Show, { nullable: true, onDelete: 'CASCADE' })
  show!: Rel<Show>  
}