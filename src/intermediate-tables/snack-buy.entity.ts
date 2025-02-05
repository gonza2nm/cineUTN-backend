import { Cascade, Collection, DateTimeType, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

import { Snack } from '../snack/snack.entity.js';
import { Buy } from '../buy/buy.entity.js';



@Entity()
export class SnackBuy extends BaseEntity {

  @ManyToOne(() => Buy, { nullable: false})
  buy!: Rel<Buy>

  @ManyToOne(() => Snack, { nullable: false })
  snack!: Rel<Snack>;

  @Property({ nullable: false })
  quantity!: number;

}
