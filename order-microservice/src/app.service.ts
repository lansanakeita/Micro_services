import { PrismaClient } from '@prisma/client';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Order, CreateOrderRequest} from './stubs/order/v1alpha/order';
import { Prisma, OrderProduct } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma:PrismaService) {}

  async GetOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany();
    return orders;
  }

  // async GetOrders(): Promise<Order[]> {
  //   const orders = await this.prisma.order.findMany({
  //     include: {
  //       orderProducts: true,
  //     },
  //   });
  //   return orders;
  // }

  async CreateOrder(order: Prisma.OrderCreateInput): Promise<Order> {
    const info = this.prisma.order.create({
      data: {
        orderProducts:order.orderProducts
      },
    });
    return info;
  }

  
  async UpdateOrder(id: number, order: Prisma.OrderUncheckedUpdateInput): Promise<Order> {
    try {
      return this.prisma.order.update({
        where: { id },
        data: {
          orderProducts:order.orderProducts,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('An error occurred while updating the commande.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteOrder(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
    
  }
}
