import { Controller, Get, Post, Body, Inject } from '@midwayjs/core';
import { OrderService } from '../service/order.service';
import { OrderDto } from '../dto/order.dto';
import { UsernameDto } from '../dto/username.dto';

@Controller('/order')
export class OrderController {
  @Inject()
  orderService: OrderService;

  // 根据用户名查询订单
  @Get('/list')
  async getOrdersByUsername(@Body() dto: UsernameDto) {
    return this.orderService.findByUsername(dto.username);
  }

  // 新增订单
  @Post('/create')
  async createOrder(@Body() dto: OrderDto) {
    return this.orderService.create(dto);
  }

  // 更新订单
  @Post('/update')
  async updateOrder(@Body() dto: { orderID: number } & Partial<OrderDto>) {
    return this.orderService.update(dto.orderID, dto);
  }

  // 删除订单
  @Post('/delete')
  async deleteOrder(@Body() dto: { orderID: number }) {
    return this.orderService.delete(dto.orderID);
  }
}