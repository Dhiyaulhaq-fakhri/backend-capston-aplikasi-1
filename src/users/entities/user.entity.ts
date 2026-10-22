import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @Column({ type: 'varchar', length: 50, default: 'user' })
    role: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 255, select: false })
    password: string;
}
