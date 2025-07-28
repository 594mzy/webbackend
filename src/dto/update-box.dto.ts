import { BlindBoxItemDto } from './blind-box-item.dto';

/**
 * 用于更新盲盒的DTO
 */
export class UpdateBlindBoxDto {
  id: number; // 盲盒ID，必填

  name?: string; // 可选，盲盒名称

  img?: string; // 可选，盲盒图片

  stock?: number; // 可选，盲盒库存数量

  items?: BlindBoxItemDto[]; // 可选，盲盒下的物品列表
}