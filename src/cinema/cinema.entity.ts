import { Cascade, Collection, Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Theater } from '../theater/theater.entity.js';
import { Movie } from '../movie/movie.entity.js';

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

  /*
  //revisar relacion con encargado

  @OneToMany(() => Manager, (manager) => manager.cinema, {
    cascade: [Cascade.ALL],
  })
  managers = new Collection<Manager>(this);
  */
}
