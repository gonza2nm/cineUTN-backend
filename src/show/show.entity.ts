import { Collection, Entity, ManyToOne, OneToMany, Property, Rel, DateTimeType } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Theater } from '../theater/theater.entity.js';
import { Movie } from '../movie/movie.entity.js';
import { Ticket } from '../ticket/ticket.entity.js';

@Entity()
export class Show extends BaseEntity {

  //formato: yyyy-mm-dd hh:mm:ss 
  //ejemplo 20 de junio del 2024 a las 21:00 = 2024-06-20 21:00:00
  //dia y inicio de la funcion
  @Property({ type: DateTimeType, nullable: false })
  dayAndTime!: Date;

  //dia y fin de la funcion
  @Property({ type: DateTimeType, nullable: false })
  finishTime!: Date;

  //Relacion con theater (salas)
  @ManyToOne(() => Theater, { nullable: false })
  theater!: Rel<Theater>


  //Relacion con pelicula
  @ManyToOne(() => Movie, { nullable: false })
  movie!: Rel<Movie>

  //Relacion con entrada
  @OneToMany(() => Ticket, (ticket) => ticket.show)
  tickets = new Collection<Ticket>(this)

}