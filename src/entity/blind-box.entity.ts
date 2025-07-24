import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('blind_box')
export class BlindBoxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  img: string;

  @Column({ type: 'int', default: 0 })
  left: number;   // 剩余数量

  @CreateDateColumn()
  createdAt: Date;
}