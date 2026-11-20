import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Livestock } from './livestock.entity.js';

@Entity('livestock_images')
export class LivestockImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({ default: 0 })
    order: number; // 0 = Foto Utama

    @ManyToOne(() => Livestock, (livestock) => livestock.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'livestockId' })
    livestock: Relation<Livestock>;

    @Column()
    livestockId: number;

    @CreateDateColumn()
    createdAt: Date;
}