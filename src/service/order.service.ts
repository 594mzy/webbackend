import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Order } from '../entity/order.entity';
import { OrderDto } from '../dto/order.dto';

@Provide()
export class OrderService {
    @InjectEntityModel(Order)
    orderRepo: Repository<Order>;

    // 查询所有订单
    async findAll(): Promise<Order[]> {
        return this.orderRepo.find();
    }

    // 根据用户名筛选订单
    async findByUsername(username: string): Promise<Order[]> {
        return this.orderRepo.find({
            where: { username: Like(`%${username}%`) },
            order: { createdAt: 'DESC' },
        });
    }

    // 新增订单
    async create(data: OrderDto): Promise<Order> {
        const order = this.orderRepo.create(data);
        return this.orderRepo.save(order);
    }

    // 更新订单
    async update(orderID: number, data: Partial<OrderDto>): Promise<Order> {
        await this.orderRepo.update(orderID, data);
        return this.orderRepo.findOneBy({ orderID });
    }

    // 删除订单
    async delete(orderID: number): Promise<boolean> {
        const res = await this.orderRepo.delete(orderID);
        return res.affected !== 0;
    }
}