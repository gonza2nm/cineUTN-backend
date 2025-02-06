import { Collection, Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Promotion } from "../promotion/promotion.entity.js";
import { Buy } from "../buy/buy.entity.js";
import { SnackBuy } from "../intermediate-tables/snack-buy.entity.js";

@Entity()
export class Snack extends BaseEntity{
  
  @Property({nullable: false})
  name!: string;
  
  @Property({nullable: true})
  description!: string;
  
  @Property({nullable: false})
  urlPhoto!: string;

  @Property({nullable: false})
  price!: number;

  @ManyToMany(() => Promotion, (promotion)=> promotion.snacks, {owner: true})
  promotions = new Collection<Promotion>(this);

  @OneToMany(() => SnackBuy, (cp) => cp.snack)
  snacksBuy = new Collection<SnackBuy>(this);

}