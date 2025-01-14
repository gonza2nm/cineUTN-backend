import { Collection, DateTimeType, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Cinema } from "../cinema/cinema.entity.js";

@Entity()
export class Promotion extends BaseEntity{

  @Property({nullable: false})
  code!: string;

  @Property({nullable: false})
  name!: string;

  @Property({nullable: false})
  description!: string;

  @Property({ type: DateTimeType, nullable: false})
  promotionStartDate = new Date();

  @Property({ type: DateTimeType, nullable: false})
  promotionFinishDate = new Date();

  @Property({nullable: false})
  discount!: number;

  @ManyToMany( () => Cinema, (cinema) => cinema.promotions)
  cinemas = new Collection<Cinema>(this);

}