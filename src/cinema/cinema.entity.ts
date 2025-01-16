import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Theater } from '../theater/theater.entity.js';
import { Movie } from '../movie/movie.entity.js';
import { User } from '../user/user.entity.js';
import { Event } from '../event/event.entity.js';
import { Promotion } from '../promotion/promotion.entity.js';

@Entity()
export class Cinema extends BaseEntity {

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false, unique: true })
  address!: string;

  @OneToMany(() => Theater, (theater) => theater.cinema, {
    cascade: [Cascade.ALL],
  })
  theaters = new Collection<Theater>(this);

  @ManyToMany(() => Movie, (movie) => movie.cinemas, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  movies = new Collection<Movie>(this);

  @OneToMany(() => User, (user) => user.cinema, {
    cascade: [Cascade.ALL],
  })
  managers = new Collection<User>(this);

  @ManyToMany(() => Event, (event) => event.cinemas)
  events = new Collection<Event>(this);

  @ManyToMany(() => Promotion, (promotion) => promotion.cinemas,{
    cascade: [Cascade.ALL],
    owner: true
  })
  promotions = new Collection<Promotion>(this);
}
