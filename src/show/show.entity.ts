import { Collection, Entity, ManyToOne, OneToMany, Property, Rel} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Theater } from '../theater/theater.entity.js';
import { Movie } from '../movie/movie.entity.js';

@Entity()
export class Show extends BaseEntity { 

  @Property({nullable: false})
  dayAndTime!: string //Buscar metodo para poner la hora y el dia.


  //Relacion con theater (salas)
  @ManyToOne(() => Theater, {nullable: false})
  theater!: Rel<Theater>


  //Relacion con pelicula
  @ManyToOne(() => Movie, {nullable: false})
  movie!: Rel<Movie>
  

  
  //Relacion con entrada
  /*
  @OneToMany(() => Ticket, (ticket) => ticket.show)
  tickets = new Collection<Ticket>(this)
  */

}