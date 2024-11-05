import { Entity, ManyToOne, Rel } from "@mikro-orm/core";
import { Show } from "../show/show.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Buy } from "../buy/buy.entity.js";


@Entity()
export class Ticket extends BaseEntity {

  @ManyToOne(() => Show, { nullable: false })
  show!: Rel<Show>;

  @ManyToOne(() => Buy, { nullable: false })
  buy!: Rel<Buy>;
}
