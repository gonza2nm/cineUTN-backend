import {Collection,OneToMany, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Movie } from '../movie/movie.entity.js';
import { Show } from '../show/show.entity.js';

@Entity()
export class Language extends BaseEntity {
  
  @Property({ nullable: false, unique: true })
  languageName!: string;

  @ManyToMany(() => Movie, (movie) => movie.languages)
  movies = new Collection<Movie>(this);

  @OneToMany(() => Show, (show) => show.language)
  shows = new Collection<Show>(this);
}