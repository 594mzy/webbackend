import { BlindBoxItemEntity } from '../entity/blind-box-item.entity';
export class CreateBlindBoxDto {
  name: string;
  img: string;
  left: number;
  items: Partial<BlindBoxItemEntity>[]; // 新增
}