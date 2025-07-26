// src/entity/blind-box-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BlindBoxEntity } from './blind-box.entity';

@Entity('blind_box_item')
export class BlindBoxItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  itemName: string;          // 物品名称

  @Column({ type: 'text', nullable: true })
  img: string;               // 物品图片

  @Column({ type: 'int', default: 0 })
  stock: number;             // 物品剩余库存

  @Column({ type: 'varchar', length: 10, default: '普通' })
  rarity: string;            // 普通 | 稀有 | 隐藏

  @Column({ type: 'real', default: 0 })
  probability: number;       // 0~1 之间的概率

  /* ---------- 外键 ---------- */
  @Column({ type: 'int' })
  blindBoxId: number;

  @ManyToOne(() => BlindBoxEntity, box => box.items)
  @JoinColumn({ name: 'blindBoxId' })
  blindBox: BlindBoxEntity;
}