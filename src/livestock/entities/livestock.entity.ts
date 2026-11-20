import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index } from 'typeorm';
import type { Relation } from 'typeorm';
import { FarmerProfile } from '../../users/entities/farmer-profile.entity.js';
import { LivestockImage } from './livestock-image.entity.js';

export enum LivestockType { SAPI = 'sapi', KAMBING = 'kambing', DOMBA = 'domba' }
export enum LivestockGender { JANTAN = 'jantan', BETINA = 'betina' }
export enum LivestockStatus { AVAILABLE = 'available', RESERVED = 'reserved', SOLD = 'sold', INACTIVE = 'inactive' }

@Entity('livestocks')
@Index(['type', 'status'])
@Index(['sellerId'])
export class Livestock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: LivestockType })
    type: LivestockType;

    @Column({ nullable: true })
    breed: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
    weightKg: number;

    @Column({ type: 'int', default: 1 })
    stock: number;

    @Column({ type: 'enum', enum: LivestockGender, nullable: true })
    gender: LivestockGender;

    @Column({ type: 'int', nullable: true })
    ageMonths: number;

    @Column({ nullable: true })
    healthNote: string;

    @Column({ nullable: true })
    location: string;

    @Column({ type: 'enum', enum: LivestockStatus, default: LivestockStatus.AVAILABLE })
    status: LivestockStatus;

    @ManyToOne(() => FarmerProfile, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'sellerId' })
    seller: Relation<FarmerProfile>;

    @Column()
    sellerId: number;

    @OneToMany(() => LivestockImage, (image) => image.livestock, { cascade: true })
    images: LivestockImage[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}