import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    orderID: number;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        comment: 'username',
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        comment: 'item ordered',
    })
    item: string;

    @CreateDateColumn()
    createdAt: Date;
}