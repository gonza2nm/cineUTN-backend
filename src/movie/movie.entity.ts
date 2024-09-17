import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Genre } from '../genre/genre.entity.js';
import { Cinema } from '../cinema/cinema.entity.js';
import { Show } from '../show/show.entity.js';
import { Format } from '../format/format.entity.js';
import { Language } from '../language/language.entity.js';

@Entity()
export class Movie extends BaseEntity {
  @Property({ nullable: false }) //no es unique porque varias peliculas pueden tener el mismo nombre
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  imageLink!: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres = new Collection<Genre>(this);

  @OneToMany(() => Show, (show) => show.movie,{cascade:[Cascade.PERSIST, Cascade.MERGE]})
  shows = new Collection<Show>(this);

  @ManyToMany(() => Cinema, (cinema) => cinema.movies)
  cinemas = new Collection<Cinema>(this);

  @ManyToMany(() => Format, (format) => format.movies, { owner: true }) 
  formats = new Collection<Format>(this);

  @ManyToMany(() => Language, (language) => language.movies, { owner: true }) 
  languages = new Collection<Language>(this);

}
