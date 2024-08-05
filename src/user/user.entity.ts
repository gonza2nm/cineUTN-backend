import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class User {

  @Property()
  name!: string;

  @Property()
  dni!: string;

  @Property()
  apellido!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  type!: string;  

  constructor(name: string, dni:string , email: string, password: string, type: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this.dni= dni;
  }
}
