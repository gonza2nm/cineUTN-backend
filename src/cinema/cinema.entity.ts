import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Theater } from '../theater/theater.entity.js';

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

  /*
  //Relacion con pelicula posibles nombres: Movie or Film

  @ManyToMany(() => Movie, (movie) => movie.cinemas, {
    cascade: [Cascade.ALL],
    owner: true //esto solo va para 
  })
  movies! = Cinema[]

  //esto deberia ser en la entidad Movie or Film

  @ManyToMany(() => Cinema, (cinema) => cinema.movies)
  cinemas = new Collection<Cinema>(this);
  
  //revisar relacion con encargado

  @OneToMany(() => Manager, (manager) => manager.cinema, {
    cascade: [Cascade.ALL],
  })
  managers = new Collection<Manager>(this);
  */
}
