import {
    Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity.js';

export enum FarmerStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

@Entity('farmer_profiles')
export class FarmerProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.farmerProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user:  Relation<User>;

    @Column({ unique: true })
    userId: number;

    @Column({ length: 150 })
    storeName: string; // Nama Kandang / Toko

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: FarmerStatus, default: FarmerStatus.PENDING })
    status: FarmerStatus;

    @Column({ nullable: true })
    ktpNumber: string;

    @Column({ nullable: true })
    nibNumber: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}