import { SoftDeletableEntity, User as MedusaUser } from '@medusajs/medusa/dist';
import { Column, Entity, Index, JoinColumn, ManyToOne,OneToOne,Timestamp } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { Store } from '../../store/entities/store.entity';
import { Role } from '../../role/role.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';
// import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { DbAwareColumn } from '@medusajs/medusa/dist/utils/db-aware-column';
// import { BeforeInsert } from 'typeorm';

export enum CustomUserRoles {
    ADMIN = "admin",
    MEMBER = "member",
    DEVELOPER = "developer",
    VENDOR = "vendor",
  }
@MedusaEntity({override: MedusaUser})
@Entity()
export class User extends MedusaUser {
  
  @DbAwareColumn({
    type: "enum",
    enum: CustomUserRoles,
    nullable: true,
    default: CustomUserRoles.MEMBER,
  })
  custom_role: CustomUserRoles

    @Index()
    @Column({ nullable: false })
    store_id: string;

    @Column({nullable: true,  type: "varchar"})
    phone: string;

    @Column({nullable: true,  type: "varchar"})
    user_name: string;

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

     @OneToOne(() => Vendor, (vendor: Vendor) => vendor.user)
     vendor: Vendor;

     
}