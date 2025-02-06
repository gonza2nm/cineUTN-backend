import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

import { Buy } from '../buy/buy.entity.js';
import { Promotion } from '../promotion/promotion.entity.js';



@Entity()
export class PromotionBuy extends BaseEntity {

  @ManyToOne(() => Buy, { nullable: false })
  buy!: Rel<Buy>
  
  @ManyToOne(() => Promotion, { nullable: false })
  promotion!: Rel<Promotion>
  
  @Property({ nullable: false })
  quantity!: number;
}
