import { 
    Column, 
    Entity,
    BeforeInsert,
    Index,
    JoinColumn, 
    ManyToOne, 
    OneToMany,
    Tree,
    TreeParent,
    TreeChildren
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@MedusaEntity()
@Entity()
@Tree('closure-table', {
    ancestorColumnName: (column) => "ancestor_id",
    descendantColumnName: (column) => "descendant_id"
})
export class Category extends SoftDeletableEntity{
    @Index({ unique: true })
    @Column()
    name: string;

    @Index()
    @Column({ nullable: false, default: '0'})
    parent_id: string;

    @ManyToOne(() => Category, (category) => category.children)
    @JoinColumn({ name: 'parent_id' })
    @TreeParent()
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    @JoinColumn({ name: 'id', referencedColumnName: 'parent_id' })
    @TreeChildren()
    children: Category[];

    @Column({type: "boolean", default: false})
    is_disabled: boolean;
    
    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "cat");
    }
}