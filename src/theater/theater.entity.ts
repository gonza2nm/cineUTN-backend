import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Theater extends BaseEntity {
  @Property({ nullable: false })
  numChairs!: number;
  @Property({ nullable: false })
  cinema!: number;
}
//faltan las relaciones
