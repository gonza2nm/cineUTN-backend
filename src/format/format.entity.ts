import {Collection, Entity, ManyToMany, OneToMany, OneToOne, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Movie } from '../movie/movie.entity.js';
import { Show } from '../show/show.entity.js';

@Entity()
export class Format extends BaseEntity {
  
  @Property({ nullable: false, unique: true })
  formatName!: string

  @ManyToMany(() => Movie, (movie) => movie.formats)
  movies = new Collection<Movie>(this);

  @OneToMany(() => Show, (show) => show.format)
  shows = new Collection<Show>(this);
}