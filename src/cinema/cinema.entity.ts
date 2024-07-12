import {
  Cascade,
  Collection,
  Entity,
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
}
