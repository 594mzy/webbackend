// src/entity/blind-box.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BlindBoxItemEntity } from './blind-box-item.entity';

@Entity('blind_box')
export class BlindBoxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  img: string;

  @CreateDateColumn()
  createdAt: Date;

  /* ---------- 新增：一个盲盒拥有多个物品 ---------- */
  @OneToMany(() => BlindBoxItemEntity, item => item.blindBox,{
    cascade: true, // 级联操作
    eager: true,   // 查询盲盒时自动加载物品
  })
  items: BlindBoxItemEntity[];
}