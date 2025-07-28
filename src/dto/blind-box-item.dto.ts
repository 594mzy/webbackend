// src/dto/create-blind-box-item.dto.ts
export class BlindBoxItemDto {
  itemName: string;
  img: string;
  stock: number;
  rarity: string = '普通';
  probability: number = 0;
  blindBoxId: number;
}