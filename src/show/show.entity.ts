import { Collection, Entity, ManyToOne, OneToMany, Property, Rel, DateTimeType} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Theater } from '../theater/theater.entity.js';
import { Movie } from '../movie/movie.entity.js';
import { Ticket } from '../ticket/ticket.entity.js';
import { Format } from '../format/format.entity.js';
import { Language } from '../language/language.entity.js';

@Entity()
export class Show extends BaseEntity {

  //formato: yyyy-mm-dd hh:mm:ss 
  @Property({ type: DateTimeType, nullable: false })
  dayAndTime!: Date;

  @Property({ type: DateTimeType, nullable: false })
  finishTime!: Date;

  @ManyToOne(() => Theater, { nullable: false })
  theater!: Rel<Theater>

  @ManyToOne(() => Movie, { nullable: true})
  movie!: Rel<Movie>

  @OneToMany(() => Ticket, (ticket) => ticket.show)
  tickets = new Collection<Ticket>(this);

  @ManyToOne(() => Format, { nullable: false })
  format!: Rel<Format>

  @ManyToOne(() => Language, { nullable: false })
  language!: Rel<Language>

}