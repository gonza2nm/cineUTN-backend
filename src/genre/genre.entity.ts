import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Genre extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string
}

//faltan relaciones con otras entidades ej: @OneToMany

