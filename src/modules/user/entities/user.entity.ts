import { User as MedusaUser } from '@medusajs/medusa/dist';
import { Column, Entity, Index, JoinColumn, ManyToOne,Timestamp } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { Store } from '../../store/entities/store.entity';
import { Role } from '../../role/role.entity';

@MedusaEntity({ override: MedusaUser })
@Entity()
export class User extends MedusaUser {
    @Index()
    @Column({ nullable: false })
    store_id: string;

    @Column({nullable: true, unique: true, type: "varchar"})
    phone: string;
    @Column({nullable: true,type: "time with time zone"})
    email_verified_at: Timestamp
    @Column({nullable: true,type: "time with time zone"})
    phone_verified_at: Timestamp

    @ManyToOne(() => Store, (store) => store.members)
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @Index()
    @Column({ nullable: true })
    role_id: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    teamRole: Role;
}