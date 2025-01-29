import { Collection, DateTimeType, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Cinema } from "../cinema/cinema.entity.js";
import { Snack } from "../snack/snack.entity.js";
import { Buy } from "../buy/buy.entity.js";

@Entity()
export class Promotion{

  @PrimaryKey({nullable: false, unique: true})
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

  @ManyToMany(() => Cinema, (cinema) => cinema.promotions)
  cinemas = new Collection<Cinema>(this);

  @ManyToMany(() => Snack, (snack)=> snack.promotions)
  snacks = new Collection<Snack>(this);

  @ManyToMany(() => Buy, (buy)=> buy.promotions, {owner: true})
  buys = new Collection<Promotion>(this);
}