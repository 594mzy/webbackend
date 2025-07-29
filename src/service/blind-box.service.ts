import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBoxEntity } from '../entity/blind-box.entity';
import { BlindBoxDto } from '../dto/blind-box.dto';
import { UpdateBlindBoxDto } from '../dto/update-box.dto';

@Provide()
export class BlindBoxService {
  @InjectEntityModel(BlindBoxEntity)
  boxRepo: Repository<BlindBoxEntity>;

  /* ---------- 仓库管理 ---------- */
  async createStock(data: BlindBoxDto) {
    const box = this.boxRepo.create(data);
    return this.boxRepo.save(box);
  }

  async findAllStock() {
    return this.boxRepo.find();
  }

  async findOneStock(id: number) {
    return this.boxRepo.findOneBy({ id });
  }

  async updateBaseInfo(id: number, data: UpdateBlindBoxDto) {
    await this.boxRepo.update(id, data);
    return this.findOneStock(id);
  }

  async decrementBoxStock(id: number, count: number) {
    const box = await this.findOneStock(id);
    if (!box || box.stock < count) {
      throw new Error('库存不足');
    }
    box.stock -= count;
    return this.boxRepo.save(box);
  }

  async deleteStock(id: number) {
    // 先删除所有关联的盲盒物品
    await this.boxRepo.manager.delete('blind_box_item', { blindBoxId: id });
    // 再删除盲盒
    const res = await this.boxRepo.delete(id);
    return res.affected !== 0;
  }
}