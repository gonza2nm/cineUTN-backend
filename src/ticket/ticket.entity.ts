import { Cascade, Entity, ManyToOne, OneToOne, Rel } from "@mikro-orm/core";
import { Show } from "../show/show.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Buy } from "../buy/buy.entity.js";
import { Seat } from "../seat/seat.entity.js";


@Entity()
export class Ticket extends BaseEntity {

  @ManyToOne(() => Show, { nullable: false })
  show!: Rel<Show>;

  @ManyToOne(() => Buy, { nullable: false, onDelete: 'CASCADE'})
  buy!: Rel<Buy>;

  //Despues cambiar el nullable a false.
  @OneToOne(() => Seat, { nullable: true })
  seat!: Rel<Seat>;

}
