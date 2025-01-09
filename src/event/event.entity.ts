import { Cascade, Collection, DateTimeType, Entity, ManyToMany, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Cinema } from "../cinema/cinema.entity.js";



@Entity()
export class Event extends BaseEntity {

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ type: DateTimeType, nullable: false })
  startDate!: Date;

  @Property({ type: DateTimeType, nullable: false })
  finishDate!: Date;

  @ManyToMany(() => Cinema, (cinema) => cinema.events, {
    cascade: [Cascade.ALL],
    owner: true
  })
  cinemas = new Collection<Cinema>(this)
}