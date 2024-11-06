import { Cascade, Collection, DateTimeType, Entity, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { User } from '../user/user.entity.js';
import { Ticket } from '../ticket/ticket.entity.js';

@Entity()
export class Buy extends BaseEntity {

  @Property({ nullable: true })
  description!: string;

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
  // @OneToMany(() => Ticket, ticket => ticket.buy, { cascade: ['remove'] })
  tickets = new Collection<Ticket>(this)

  //Relacion con la entidad productos
  /*
  @ManyToMany(() => Product, (product) => product.buy)
  products = new Collection<Producto>(this)
  */
}