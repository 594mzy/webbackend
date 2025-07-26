import { Controller, Post, Get, Body, Inject, Param } from '@midwayjs/core';
import { BlindBoxService } from '../service/blind-box.service';
import { BlindBoxItemService } from '../service/blind-box-item.service';
import { UserService } from '../service/user.service';
import { CreateBlindBoxDto } from '../dto/blind-box.dto';
import { BlindBoxEntity } from '../entity/blind-box.entity';
import { BlindBoxItemEntity } from '../entity/blind-box-item.entity';

// 简单互斥锁实现
let drawLock = false;

@Controller('/blind-box')
export class BlindBoxController {
    @Inject()
    blindBoxService: BlindBoxService;

    @Inject()
    blindBoxItemService: BlindBoxItemService;

    @Inject()
    userService: UserService;

    /**
     * 1. 获取盲盒列表（前端渲染用）
     */
    @Get('/list')
    async getBlindBoxList(): Promise<BlindBoxEntity[]> {
        // 查询所有盲盒及其物品
        return this.blindBoxService.boxRepo.find({ relations: ['items'] });
    }

    /**
     * 2. 盲盒仓库增删改查（管理员操作）
     */
    // 新增盲盒
    @Post('/admin/create')
    async createBlindBox(@Body() dto: CreateBlindBoxDto): Promise<BlindBoxEntity> {
        return this.blindBoxService.createStock(dto);
    }

    // 查询所有盲盒（和渲染列表类似）
    @Get('/admin/list')
    async adminList(): Promise<BlindBoxEntity[]> {
        return this.blindBoxService.boxRepo.find({ relations: ['items'] });
    }

    // 更新盲盒
    @Post('/admin/update/:id')
    async updateBlindBox(@Param('id') id: number, @Body() dto: Partial<BlindBoxEntity>): Promise<BlindBoxEntity> {
        return this.blindBoxService.updateBaseInfo(id, dto);
    }

    // 删除盲盒
    @Post('/admin/delete/:id')
    async deleteBlindBox(@Param('id') id: number): Promise<boolean> {
        return this.blindBoxService.deleteStock(id);
    }

    /**
     * 3. 盲盒物品仓库增删改查（管理员操作）
     */
    // 新增物品
    @Post('/admin/item/create')
    async createItem(@Body() dto: Partial<BlindBoxItemEntity>): Promise<BlindBoxItemEntity> {
        return this.blindBoxItemService.create(dto);
    }

    // 查询某个盲盒下所有物品
    @Get('/admin/item/list/:boxId')
    async listItems(@Param('boxId') boxId: number): Promise<BlindBoxItemEntity[]> {
        return this.blindBoxItemService.findByBoxId(boxId);
    }

    // 更新物品
    @Post('/admin/item/update/:id')
    async updateItem(@Param('id') id: number, @Body() dto: Partial<BlindBoxItemEntity>): Promise<BlindBoxItemEntity> {
        return this.blindBoxItemService.update(id, dto);
    }

    // 删除物品
    @Post('/admin/item/delete/:id')
    async deleteItem(@Param('id') id: number): Promise<boolean> {
        return this.blindBoxItemService.delete(id);
    }

    /**
     * 4. 用户抽取盲盒（带概率、互斥锁）
     */
    @Post('/draw/:boxId')
    async drawBlindBox(@Param('boxId') boxId: number, @Body('userId') userId: number): Promise<{ item?: BlindBoxItemEntity; msg: string }> {
        // 简单互斥锁，防止并发抽取
        if (drawLock) {
            return { msg: '当前有用户正在抽取，请稍后再试' };
        }
        drawLock = true;
        try {
            // 查询盲盒所有物品
            const items = await this.blindBoxItemService.findByBoxId(boxId);
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
            await this.blindBoxItemService.decrementStock(selected.id, 1);

            return { item: selected, msg: '抽取成功' };
        } catch (err) {
            return { msg: '抽取失败，请重试' };
        } finally {
            drawLock = false;
        }
    }
}