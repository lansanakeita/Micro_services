import { PrismaClient } from '@prisma/client';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Order, CreateOrderRequest } from './stubs/order/v1alpha/order';
import { Prisma, OrderProduct } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma:PrismaService) {}

  // async GetOrders(): Promise<Order[]> {
  //   const orders = await this.prisma.order.findMany();
  //   return orders;
  // }

  async GetOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        orderProducts: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });
    return orders;
  }


  // async CreateOrder(orderRequest: CreateOrderRequest): Promise<Order> {
  //   try {
  //     const { idProduct } = orderRequest;
  //     const createdOrder = await this.prisma.order.create({
  //       data: {
  //       },
  //     });

  //     if (idProduct && idProduct.length > 0) {
  //       const orderProducts = idProduct.map((productId) => ({
  //         orderId: createdOrder.id,
  //         productId,
  //         quantity: 1, 
  //       }));

  //       // Create the OrderProducts associated with the Order using Prisma
  //       await this.prisma.orderProduct.createMany({
  //         data: orderProducts,
  //       });
  //     }

  //     const resultOrder: Order = {
  //       id: createdOrder.id,
  //       orderProductInfos: {
  //         productId: orderRequest.idProduct as any
  //       },
  //     };

  //     return resultOrder;
  //   } catch (error) {
  //     throw new HttpException('Error creating the order', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


  async CreateOrder(orderRequest: CreateOrderRequest): Promise<Order> {
    try {
      const { productId, quantity } = orderRequest;
      const createdOrder = await this.prisma.order.create({
        data: {
        },
      });
  
      if (productId && productId.length > 0 && quantity && quantity.length > 0) {
        const orderProductsData = productId.map((productId, index) => ({
          orderId: createdOrder.id,
          productId: productId,
          quantity: quantity[index],
        }));
  
        // Create the OrderProducts associated with the Order using Prisma
        await this.prisma.orderProduct.createMany({
          data: orderProductsData,
        });
      }
  
      const resultOrder: Order = {
        id: createdOrder.id,
      };
  
      return resultOrder;
    } catch (error) {
      throw new HttpException('Error creating the order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
