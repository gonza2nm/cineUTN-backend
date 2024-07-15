import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class Movie extends BaseEntity {
  @Property({ nullable: false }) // no le pongo unique porque hay peliculas de mismo nombre
  name!: string

  @Property({ nullable: false })
  description!: string

  @Property({ nullable: false })
  format!: string
}