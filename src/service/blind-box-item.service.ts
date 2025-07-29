// src/service/blind-box-item.service.ts
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBoxService } from './blind-box.service';
import { BlindBoxItemEntity } from '../entity/blind-box-item.entity';
import { BlindBoxItemDto } from '../dto/blind-box-item.dto';
import { UpdateBlindBoxItemDto } from '../dto/update-item.dto';

@Provide()
export class BlindBoxItemService {
  @InjectEntityModel(BlindBoxItemEntity)
  itemRepo: Repository<BlindBoxItemEntity>;

  @Inject()
  blindBoxService: BlindBoxService;

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
  async drawItemFromBox(boxId: number, userId?: number): Promise<{ item?: BlindBoxItemEntity; msg: string }> {
    // 查询盲盒所有物品
    const items = await this.findByBoxId(boxId);
    // 过滤库存大于0的物品
    const availableItems = items.filter(item => item.stock > 0);
    if (availableItems.length === 0) {
      return { msg: '该盲盒已无库存' };
    }
    // 按概率抽取
    const rand = Math.random();
    let sum = 0;
    let selected: BlindBoxItemEntity | null = null;
    for (const item of availableItems) {
      sum += item.probability;
      if (rand <= sum) {
        selected = item;
        break;
      }
    }
    // 如果概率未覆盖到1，兜底抽最后一个
    if (!selected) selected = availableItems[availableItems.length - 1];

    // 扣减库存（原子操作）
    await this.decrementStock(selected.id, 1);
    // TODO: 可在此处调用用户背包逻辑，如：await this.userService.addItemToUser(userId, selected.id);

    // 盲盒总库存减少（如有需要可调用 BlindBoxService.decrementBoxStock）
    await this.blindBoxService.decrementBoxStock(boxId, 1);

    return { item: selected, msg: '抽取成功' };
  }
}