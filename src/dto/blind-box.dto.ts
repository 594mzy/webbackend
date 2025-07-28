import { BlindBoxItemEntity } from '../entity/blind-box-item.entity';
export class BlindBoxDto {
  name: string;
  img: string;
  stock: number;
  items: Partial<BlindBoxItemEntity>[]; // 新增
}