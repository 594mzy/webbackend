// src/service/blind-box-item.service.ts
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBoxItemEntity } from '../entity/blind-box-item.entity';
import { BlindBoxItemDto } from '../dto/blind-box-item.dto';
import { UpdateBlindBoxItemDto } from '../dto/update-item.dto';

@Provide()
export class BlindBoxItemService {
  @InjectEntityModel(BlindBoxItemEntity)
  itemRepo: Repository<BlindBoxItemEntity>;

  /* ---------- 库存原子操作 ---------- */
  async decrementStock(id: number, qty: number) {
    return this.itemRepo.decrement({ id }, 'stock', qty);
  }

  async incrementStock(id: number, qty: number) {
    return this.itemRepo.increment({ id }, 'stock', qty);
  }

  /* ---------- 查询 ---------- */
  async findByBoxId(boxId: number) {
    return this.itemRepo.find({ where: { blindBoxId: boxId } });
  }

  /* ---------- 新增/修改/删除物品 ---------- */
  async create(data: BlindBoxItemDto) {
    const item = this.itemRepo.create(data);
    return this.itemRepo.save(item);
  }

  async update(id: number, data: UpdateBlindBoxItemDto) {
    await this.itemRepo.update(id, data);
    return this.itemRepo.findOneBy({ id });
  }

  async delete(id: number) {
    const res = await this.itemRepo.delete(id);
    return res.affected !== 0;
  }
}