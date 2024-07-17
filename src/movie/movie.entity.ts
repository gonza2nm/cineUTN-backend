import { Collection, Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Genre } from "../genre/genre.entity.js";
import { Cinema } from "../cinema/cinema.entity.js";
import { Show } from "../show/show.entity.js";

@Entity()
export class Movie extends BaseEntity {

  @Property({ nullable: false }) // no le pongo unique porque hay peliculas de mismo nombre
  name!: string

  @Property({ nullable: false })
  description!: string

  @Property({ nullable: false })
  format!: string

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres = new Collection<Genre>(this)

  /* por las dudas lo dejamos durmiendo por ahora

  @ManyToMany(()=> Cinema), (cinema) => cinema.movies)
  cinemas = new Collection<Cinema>(this) 
  */


  //Relacion con Funcion ---------------- Modificado por Sabrina.
  
  @OneToMany(() => Show, (show) => show.movie )
  shows = new Collection<Show>(this)
  
}