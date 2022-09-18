import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
  } from "typeorm"
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa/dist/interfaces/models/soft-deletable-entity";

@MedusaEntity()
@Entity()
export class Vendor extends SoftDeletableEntity{
    @Column()
    name: string;
}