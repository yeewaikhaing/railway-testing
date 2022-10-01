import { 
    Column, 
    Entity,
    BeforeInsert,
    Index,
    JoinColumn, 
    ManyToOne, 
    OneToMany
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@MedusaEntity()
@Entity()
export class Category extends SoftDeletableEntity{
    @Index({ unique: true })
    @Column()
    name: string;

    @Index()
    @Column({ nullable: false, default: '0'})
    parent_id: string;

    @ManyToOne(() => Category, (category) => category.children)
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    @JoinColumn({ name: 'id', referencedColumnName: 'parent_id' })
    children: Category[];

    @Column({type: "boolean", default: false})
    is_disabled: boolean;
    
    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "cat");
    }
}