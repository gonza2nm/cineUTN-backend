import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Cinema } from '../cinema/cinema.entity.js';
@Entity()
export class Theater extends BaseEntity {
  @Property({ nullable: false })
  numChairs!: number;
  @ManyToOne(() => Cinema, { nullable: false })
  cinema!: Rel<Cinema>;
}
