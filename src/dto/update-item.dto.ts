// src/dto/update-blind-box-item.dto.ts
/**
 * 用于更新盲盒物品的DTO
 */
export class UpdateBlindBoxItemDto {
  id: number; // 物品ID，必填

  itemName?: string;

  img?: string;

  stock?: number;

  rarity?: string;

  probability?: number;
}