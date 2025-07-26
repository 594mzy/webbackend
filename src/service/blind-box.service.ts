import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBoxEntity } from '../entity/blind-box.entity';
import { CreateBlindBoxDto } from '../dto/blind-box.dto';

@Provide()
export class BlindBoxService {
  @InjectEntityModel(BlindBoxEntity)
  boxRepo: Repository<BlindBoxEntity>;

  /* ---------- 仓库管理 ---------- */
  async createStock(data:  CreateBlindBoxDto) {
    const box = this.boxRepo.create(data);
    return this.boxRepo.save(box);
  }

  async findAllStock() {
    return this.boxRepo.find();
  }

  async findOneStock(id: number) {
    return this.boxRepo.findOneBy({ id });
  }

  async updateBaseInfo(id: number, data: Partial<BlindBoxEntity>) {
    await this.boxRepo.update(id, data);
    return this.findOneStock(id);
  }

  async deleteStock(id: number) {
    const res = await this.boxRepo.delete(id);
    return res.affected !== 0;
  }
}