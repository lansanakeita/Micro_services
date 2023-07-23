import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  DeleteOrderRequest,
  DeleteOrderResponse,
  FindOrderRequest,
  FindOrderResponse,
  ORDER_SERVICE_NAME,
  Order,
  OrderServiceController,
  OrderServiceControllerMethods,
  UpdateOrderRequest,
  UpdateOrderResponse,
} from 'src/stubs/order/v1alpha/order';

import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { OrderService } from './order.service';

@Controller()
@OrderServiceControllerMethods()
export class OrderController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod(ORDER_SERVICE_NAME)
  async findOrder(
    request: FindOrderRequest,
    metadata?: Metadata,
  ): Promise<FindOrderResponse> {
    try {
      if (request.id && request.userId) {
        const orders = await this.orderService.findSpecificUserOrder(
          request.id,
          request.userId,
        );
        return {
          orders: [orders],
          status: {
            code: HttpStatus.OK,
            message: `Orders ${request.id} has been retrieved successfully`,
          },
        };
      } else if (request.id && !request.userId) {
        const order = await this.orderService.findOrdersById(request.id);
        return {
          orders: [order],
          status: {
            code: HttpStatus.OK,
            message: `Orders ${request.id} has been retrieved successfully`,
          },
        };
      } else if (!request.id && request.userId) {
        const orders = await this.orderService.findOrdersByUser(request.userId);
        return {
          orders,
          status: {
            code: HttpStatus.OK,
            message: `Orders ${request.id} has been retrieved successfully`,
          },
        };
      } else {
        const orders = await this.orderService.findAll();
        const formattedOrders = orders.map((order) => ({
          id: order.id,
          productId: order.productId,
          quantity: order.quantity,
        }));

        const response: FindOrderResponse = {
          orders: formattedOrders,
          status: {
            code: HttpStatus.OK,
            message: 'All orders has been retrieved successfully',
          },
        };

        return response;
      }
    } catch (error) {
      return {
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error.message,
        },
      };
    }
  }

  @GrpcMethod(ORDER_SERVICE_NAME)
  async createOrder(
    request: CreateOrderRequest,
    metadata?: Metadata,
  ): Promise<CreateOrderResponse> {
    try {
      const order = await this.orderService.CreateOrder(request);

      const formattedOrder: Order = {
        id: order.id,
        productId: request.productId || [],
        quantity: request.quantity || [],
      };

      return {
        order: formattedOrder,
        status: {
          code: HttpStatus.CREATED,
          message: 'Order has been registered successfully',
        },
      };
    } catch (error) {
      return {
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error.message,
        },
      };
    }
  }

  @GrpcMethod(ORDER_SERVICE_NAME)
  async updateOrder(
    request: UpdateOrderRequest,
    metadata?: Metadata,
  ): Promise<UpdateOrderResponse> {
    const id = request.id;
    try {
      if (!request.order) {
        return {
          status: {
            code: HttpStatus.BAD_REQUEST,
            message: 'Update failed. No information provided',
          },
        };
      }

      const order = await this.orderService.UpdateOrder(id, request.order);

      const formattedOrder: Order = {
        id: order.id,
        productId: request.order.productId || [],
        quantity: request.order.quantity || [],
      };

      return {
        order: formattedOrder,
        status: {
          code: HttpStatus.OK,
          message: `Order ${order.id} has been updated successfully`,
        },
      };
    } catch (error) {
      return {
        status: {
          code: HttpStatus.OK,
          message: error.message,
        },
      };
    }
  }

  @GrpcMethod(ORDER_SERVICE_NAME)
  async deleteOrder(
    request: DeleteOrderRequest,
    metadata?: Metadata,
  ): Promise<DeleteOrderResponse> {
    const id = request.id;
    try {
      const order = await this.orderService.deleteOrder(id);

      if (order !== null) {
        return {
          status: {
            code: HttpStatus.OK,
            message: 'Order ${id} deleted successfully',
          },
        };
      } else {
        return {
          status: {
            code: HttpStatus.NOT_FOUND,
            message: 'Order ${id} not found',
          },
        };
      }
    } catch (error) {
      if (error.meta?.cause === 'Record to delete does not exist.') {
        return {
          status: {
            code: HttpStatus.OK,
            message: 'Order ${id} deleted successfully',
          },
        };
      }

      // Sinon, une autre erreur s'est produite, renvoyer un message d'erreur générique
      return {
        status: {
          code: HttpStatus.OK,
          message: 'Order ${id} could not be deleted',
        },
      };
    }
  }
}
