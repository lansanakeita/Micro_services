import { Controller, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Order, GetOrderResponse, CreateOrderRequest, UpdateOrderRequest, DeleteOrderRequest, ORDER_SERVICE_NAME, OrderServiceController,
  OrderServiceControllerMethods, GetOrderRequest } from './stubs/order/v1alpha/order';
import { Metadata } from "@grpc/grpc-js";
import {RpcException} from "@nestjs/microservices/exceptions";
import {GrpcMethod} from "@nestjs/microservices";

@Controller()
@OrderServiceControllerMethods()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @GrpcMethod(ORDER_SERVICE_NAME)
  async getOrders(request: CreateOrderRequest,metadata?: Metadata): Promise<GetOrderResponse>{
    try {
      const orders = await this.appService.GetOrders();
      const formattedOrders = orders.map((order) => ({
        id: order.id,
        productId: order.productId,
        quantity: order.quantity,
      }));
      
      const response: GetOrderResponse = {
        orders: formattedOrders,
      };
      
      return response;
    } catch (error) {
      throw new RpcException("erreur de la récupération des éléments");
    }
  }

  @GrpcMethod(ORDER_SERVICE_NAME)
  async createOrder(
    request: CreateOrderRequest,
    metadata?: Metadata,
  ): Promise<Order> {
    try {
      const order = await this.appService.CreateOrder(request);

      const formattedOrder: Order = {
        id: order.id,
        productId: request.productId || [],
        quantity: request.quantity || [],
      };

      return formattedOrder;
    } catch (error) {
      throw new RpcException('erreur de la création de la commande');
    }
  }


  @GrpcMethod(ORDER_SERVICE_NAME)
  async updateOrder(request: UpdateOrderRequest,metadata?: Metadata): Promise<Order> {
    const id = request.id;
    try {
      if (!request.order) {
        throw new RpcException('Les informations de mise à jour de la commande ne sont pas fournies.');
      }

      const order = await this.appService.UpdateOrder(id, request.order);

      const formattedOrder: Order = {
        id: order.id,
        productId: request.order.productId || [], 
        quantity: request.order.quantity || [], 
      };

      return formattedOrder;
    } catch (error) {
      throw new RpcException('Erreur lors de la mise à jour de la commande.');
    }
  }

  

  @GrpcMethod(ORDER_SERVICE_NAME)
  async deleteOrder(request: DeleteOrderRequest,metadata?: Metadata): Promise<string> {
    const id = request.id;
    try {
      const order = await this.appService.deleteOrder(id);

      if (order !== null) {
        return 'La commande a été supprimée avec succès.';
      } else {
        throw new RpcException('La commande n\'existe pas ou a déjà été supprimée.');
      }
    } catch (error) {
      if (error.meta?.cause === 'Record to delete does not exist.') {
        return 'La commande a été supprimée avec succès.';
      }

      // Sinon, une autre erreur s'est produite, renvoyer un message d'erreur générique
      throw new RpcException('Erreur lors de la suppression de la commande.');
    }
  }
}
