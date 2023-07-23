import { CreateOrderRequest, Order } from 'src/stubs/order/v1alpha/order';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { OrderProduct } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  FindRequest,
  USER_SERVICE_NAME,
  USER_V1ALPHA_PACKAGE_NAME,
  UserServiceClient,
} from 'src/stubs/user/v1alpha/user';
import { ClientGrpc } from '@nestjs/microservices';
import {
  PRODUCT_SERVICE_NAME,
  PRODUCT_V1ALPHA_PACKAGE_NAME,
  ProductServiceClient,
} from 'src/stubs/product/v1alpha/product';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  private userService: UserServiceClient;
  private productService: ProductServiceClient;

  constructor(
    @Inject(USER_V1ALPHA_PACKAGE_NAME) private userClient: ClientGrpc,
    @Inject(PRODUCT_V1ALPHA_PACKAGE_NAME) private productClient: ClientGrpc,
    private readonly prisma: PrismaService,
  ) {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    console.log(
      '🚀 ~ file: order.service.ts:29 ~ OrderService ~ userService:',
      this.userService,
    );
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
    console.log(
      '🚀 ~ file: order.service.ts:35 ~ OrderService ~ this.productService:',
      this.productService,
    );
  }

  async findAll(): Promise<Order[]> {
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

  async findOrdersById(id: number) {
    const ordersById = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });
    return ordersById;
  }

  async findOrdersByUser(userId: number) {
    const ordersByUser = await this.prisma.order.findMany({
      where: {
        userId,
      },
    });
    return ordersByUser;
  }

  async findSpecificUserOrder(id: number, userId: number) {
    const specificOrder = await this.prisma.order.findFirst({
      where: {
        id,
        userId,
      },
    });
    return specificOrder;
  }

  async CreateOrder(orderRequest: CreateOrderRequest): Promise<Order> {
    try {
      const { productId, quantity } = orderRequest;
      const createdOrder = await this.prisma.order.create({ data: {} as any });

      if (
        productId &&
        productId.length > 0 &&
        quantity &&
        quantity.length > 0
      ) {
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
      throw new HttpException(
        'Error creating the order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async UpdateOrder(
    id: number,
    orderRequest: CreateOrderRequest,
  ): Promise<Order> {
    try {
      const { productId, quantity } = orderRequest;
      await this.prisma.order.update({
        where: { id },
        data: {},
      });

      if (
        productId &&
        productId.length > 0 &&
        quantity &&
        quantity.length > 0
      ) {
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
      throw new HttpException(
        'An error occurred while updating the order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'An error occurred while deleting the order.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
