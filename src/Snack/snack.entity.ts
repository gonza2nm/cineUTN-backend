import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Promotion } from "../promotion/promotion.entity.js";
import { Buy } from "../buy/buy.entity.js";

@Entity()
export class Snack extends BaseEntity{
  
  @Property({nullable: false})
  name!: string;
  
  @Property({nullable: true})
  description!: string;
  
  @Property({nullable: false})
  urlPhoto!: string;

  @ManyToMany(() => Promotion, (promotion)=> promotion.snacks, {owner: true})
  promotions = new Collection<Promotion>(this);

  @ManyToMany(() => Buy, (buy)=> buy.snacks, {owner: true})
  buys = new Collection<Promotion>(this);
}