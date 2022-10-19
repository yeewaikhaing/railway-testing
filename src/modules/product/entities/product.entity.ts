import { Product as MedusaProduct } from '@medusajs/medusa/dist';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { Store } from '../../store/entities/store.entity';
import { Category } from '../../category/entities/category.entity';

@MedusaEntity({ override: MedusaProduct })
@Entity()
export class Product extends MedusaProduct {
    @Index()
    @Column({ nullable: false })
    store_id: string;

    @Column({ type: 'float', default: 0 })
    commission: number;

    @ManyToOne(() => Store, (store) => store.members)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store: Store;


    @ManyToMany(() => Category)
    @JoinTable({
        name: 'product_category',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        }
    })
    categories: Category[];


}