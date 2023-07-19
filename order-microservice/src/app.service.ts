import { PrismaClient } from '@prisma/client';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Order } from './stubs/order/v1alpha/order';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma:PrismaService) {}

  async GetOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany();
    return orders;
  }

  async CreateOrder(order: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data: {
        idProduct:order.idProduct,
        quantityProduct: order.quantityProduct,
      },
    });
  }

  async UpdateOrder(id: number, order: Prisma.OrderUpdateInput): Promise<Order> {
    try {
      return this.prisma.order.update({
        where: { id },
        data: {
          idProduct:order.idProduct,
          quantityProduct: order.quantityProduct
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
