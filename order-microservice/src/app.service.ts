import { PrismaClient } from '@prisma/client';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Order, CreateOrderRequest } from './stubs/order/v1alpha/order';
import { Prisma, OrderProduct } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma:PrismaService) {}

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
  
    // Formater les commandes et les produits associés dans le format attendu par le message protobuf
    const formattedOrders = orders.map((order) => {
      const orderProducts = order.orderProducts as OrderProduct[];
      const formattedOrder: Order = {
        id: order.id,
        productId: orderProducts.map((product) => product.productId),
        quantity: orderProducts.map((product) => product.quantity),
      };
      return formattedOrder;
    });
  
    return formattedOrders;
  }
  

  async CreateOrder(orderRequest: CreateOrderRequest): Promise<Order> {
    try {
      const { productId, quantity } = orderRequest;
      const createdOrder = await this.prisma.order.create({
        data: {},
      });
  
      if (productId && productId.length > 0 && quantity && quantity.length > 0) {
        const orderProductsData = productId.map((productId, index) => ({
          orderId: createdOrder.id,
          productId: productId,
          quantity: quantity[index],
        }));
  
        await this.prisma.orderProduct.createMany({
          data: orderProductsData,
        });
      }
  
      // Format the order to include productId and quantity arrays
      const formattedOrder: Order = {
        id: createdOrder.id,
        productId: productId || [], 
        quantity: quantity || [], 
      };
  
      return formattedOrder;
    } catch (error) {
      throw new HttpException('Error creating the order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  async UpdateOrder(id: number, orderRequest: CreateOrderRequest): Promise<Order> {
    try {
      const { productId, quantity } = orderRequest;
      await this.prisma.order.update({
        where: { id },
        data: {},
      });
  
      if (productId && productId.length > 0 && quantity && quantity.length > 0) {
        const orderProductsData = productId.map((productId, index) => ({
          orderId: id,
          productId: productId,
          quantity: quantity[index],
        }));
  
        // Supprimez d'abord tous les produits existants liés à la commande avant d'en ajouter de nouveaux
        await this.prisma.orderProduct.deleteMany({
          where: {
            orderId: id,
          },
        });
  
        // Créez les nouveaux produits liés à la commande
        await this.prisma.orderProduct.createMany({
          data: orderProductsData,
        });
      }
  
      const formattedOrder: Order = {
        id,
        productId: productId || [],
        quantity: quantity || [],
      };
  
      return formattedOrder;
    } catch (error) {
      throw new HttpException('An error occurred while updating the order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async deleteOrder(id: number): Promise<Order | null> {
    try {
      // Supprimer les produits et les quantités associées à la commande en premier
      await this.prisma.orderProduct.deleteMany({
        where: {
          orderId: id,
        },
      });

      // Ensuite, supprimer la commande en fonction de son identifiant (id) et renvoyer la commande supprimée
      const deletedOrder = await this.prisma.order.delete({
        where: { id },
      });

      return deletedOrder;
    } catch (error) {
      console.error(error);
      throw new HttpException('An error occurred while deleting the order.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
