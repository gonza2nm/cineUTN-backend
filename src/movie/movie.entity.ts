import {Collection,Entity,ManyToMany,OneToMany,Property,} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Genre } from '../genre/genre.entity.js';
import { Cinema } from '../cinema/cinema.entity.js';
import { Show } from '../show/show.entity.js';

@Entity()
export class Movie extends BaseEntity {
  
  @Property({ nullable: false }) //no es unique porque varias peliculas pueden tener el mismo nombre
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  format!: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres = new Collection<Genre>(this);

  @OneToMany(() => Show, (show) => show.movie)
  shows = new Collection<Show>(this);

  @ManyToMany(() => Cinema, (cinema) => cinema.movies)
  cinemas = new Collection<Cinema>(this);

  /* por las dudas lo dejamos durmiendo por ahora
  
  @OneToMany(() => MovieFunction, (movieFunction) => movieFunction.movies )
  movieFunctions = new Collection<MovieFunction>(this)
  */
}
