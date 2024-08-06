import { Entity, ManyToOne,Rel, Property, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Cinema } from '../cinema/cinema.entity.js';
import { Buy } from '../buy/buy.entity.js';

@Entity()
export class User extends BaseEntity{
  
  @Property({unique:true, nullable:false})
  dni!: string;
  
  @Property({nullable:false})
  name!: string;

  @Property({nullable:false})
  surname!: string;

  @Property({nullable: false, unique:true})
  email!: string;

  @Property({nullable: false})
  password!: string;

  @Property({nullable: false})
  type!: "user" | "admin";  

  @ManyToOne(() => Cinema)
  Cinema!: Rel<Cinema>

  @OneToMany(() => Buy, (buy) => buy.user, { cascade: [Cascade.ALL] })
  buys = new Collection<Buy>(this);
}
