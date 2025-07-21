import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    userID: number;

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false,
        comment: 'Unique username',
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        comment: 'User password',
    })
    password: string;
}