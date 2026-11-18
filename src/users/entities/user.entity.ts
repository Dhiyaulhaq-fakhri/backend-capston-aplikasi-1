import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum.js';
import { FarmerProfile } from './farmer-profile.entity.js';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column({ type: 'varchar', length: 70, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 25, nullable: true })
    phone: string | null;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
    role: UserRole;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn() 
    deletedAt: Date | null;

    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @OneToOne(() => FarmerProfile, (profile) => profile.user)
    farmerProfile?: Relation<FarmerProfile>
}
