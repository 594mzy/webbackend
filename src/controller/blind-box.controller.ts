import { Controller, Post, Get, Body, Inject} from '@midwayjs/core';
import { BlindBoxService } from '../service/blind-box.service';
import { BlindBoxItemService } from '../service/blind-box-item.service';
import { UserService } from '../service/user.service';
import { BlindBoxDto } from '../dto/blind-box.dto';
import { BlindBoxItemDto } from '../dto/blind-box-item.dto';
import { UpdateBlindBoxDto } from '../dto/update-box.dto';
import { UpdateBlindBoxItemDto } from '../dto/update-item.dto';
import { DrawDto } from '../dto/draw.dto';
import { IDDto } from '../dto/ID.dto';
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
    async createBlindBox(@Body() dto: BlindBoxDto): Promise<BlindBoxEntity> {
        return this.blindBoxService.createStock(dto);
    }

    // 查询所有盲盒（和渲染列表类似）
    @Get('/admin/list')
    async adminList(): Promise<BlindBoxEntity[]> {
        return this.blindBoxService.boxRepo.find({ relations: ['items'] });
    }

    // 查询某个盲盒下所有物品
    @Post('/admin/list')
    async listBoxAndItems(@Body() dto: IDDto): Promise<BlindBoxEntity> {
        return this.blindBoxService.findOneStock(dto.ID);
    }

    // 更新盲盒
    @Post('/admin/update')
    async updateBlindBox(@Body() dto: UpdateBlindBoxDto): Promise<BlindBoxEntity> {
        return this.blindBoxService.updateBaseInfo(dto.id, dto);
    }

    // 删除盲盒
    @Post('/admin/delete')
    async deleteBlindBox(@Body() dto: IDDto): Promise<boolean> {
        return this.blindBoxService.deleteStock(dto.ID);
    }

    /**
     * 3. 盲盒物品仓库增删改查（管理员操作）
     */
    // 新增物品
    @Post('/admin/item/create')
    async createItem(@Body() dto: BlindBoxItemDto): Promise<BlindBoxItemEntity> {
        return this.blindBoxItemService.create(dto);
    }

    // 查询某个盲盒下所有物品
    @Post('/admin/item/list')
    async listItems(@Body() dto: IDDto): Promise<BlindBoxItemEntity[]> {
        return this.blindBoxItemService.findByBoxId(dto.ID);
    }

    // 更新物品
    @Post('/admin/item/update')
    async updateItem(@Body() dto: UpdateBlindBoxItemDto): Promise<BlindBoxItemEntity> {  
        return this.blindBoxItemService.update(dto.id, dto);
    }

    // 删除物品
    @Post('/admin/item/delete')
    async deleteItem(@Body() dto: IDDto): Promise<boolean> {
        return this.blindBoxItemService.delete(dto.ID);
    }

    /**
     * 4. 用户抽取盲盒（带概率、互斥锁）
     */
    @Post('/draw')
    async drawBlindBox(@Body() dto: DrawDto): Promise<{ item?: BlindBoxItemEntity; msg: string }> {
        // 简单互斥锁，防止并发抽取
        if (drawLock) {
            return { msg: '当前有用户正在抽取，请稍后再试' };
        }
        drawLock = true;
        try {
            // 调用 service 层的抽取逻辑
            const result = await this.blindBoxItemService.drawItemFromBox(dto.boxID, dto.userID);
            return result;
        } catch (err) {
            return { msg: '抽取失败，请重试' };
        } finally {
            drawLock = false;
        }
    }
}