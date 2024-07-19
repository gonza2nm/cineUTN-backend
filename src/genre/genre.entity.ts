import { Cascade, Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Movie } from '../movie/movie.entity.js';

@Entity()
export class Genre extends BaseEntity {
  
  @Property({ nullable: false, unique: true })
  name!: string

  @ManyToMany(() => Movie, (movie) => movie.genres, //apunta hacia movie, desde movie se puede volver desde movie.genres
    { cascade: [Cascade.ALL], owner: true }) // update y delete se manejan con cascade, genre es el owner de la relacion o sea controla la relacion
  movies = new Collection<Movie>(this) //esto es un "array" de mikroORM, le digo de que clase es "Movie", this se refiere a la instancia actual de genre.Esto es necesario para que la Collection sepa a qué entidad pertenece
}



