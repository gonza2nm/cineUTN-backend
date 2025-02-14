import { Cascade, Collection, DateTimeType, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { User } from '../user/user.entity.js';
import { Ticket } from '../ticket/ticket.entity.js';
import { SnackBuy } from '../intermediate-tables/snack-buy.entity.js';
import { PromotionBuy } from '../intermediate-tables/promotion-buy.entity.js';

@Entity()
export class Buy extends BaseEntity {

  @Property({ nullable: false })
  total!: number;

  @Property({ nullable: false })
  status!: string;

  @Property({ type: DateTimeType })
  fechaHora = new Date();

  //Relacion con la entidad usuario
  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user!: Rel<User>

  //Relacion con la entidad entrada
  @OneToMany(() => Ticket, (ticket) => ticket.buy, { cascade: [Cascade.REMOVE] })
  tickets = new Collection<Ticket>(this)

  @OneToMany(() => SnackBuy, (cp) => cp.buy)
  snacksBuy = new Collection<SnackBuy>(this);

  @OneToMany(() => PromotionBuy, (cp) => cp.buy)
  promotionsBuy = new Collection<PromotionBuy>(this);

}