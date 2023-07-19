import { Controller, Get} from '@nestjs/common';
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
  async getOrders(
    request: GetOrderRequest,
    metadata?: Metadata,
  ): Promise<GetOrderResponse>{
    try{
      const orders = await this.appService.GetOrders();
      return {orders};
    }catch(error){
      throw new RpcException("erreur de la récupération des éléments");
    }
  }

  @GrpcMethod(ORDER_SERVICE_NAME)
  async createOrder(request: CreateOrderRequest, metadata?: Metadata): Promise<Order>{
    try{
      const order = await this.appService.CreateOrder(request as any);
      return order;
    }catch(error){
      throw new RpcException("erreur de la création de la commande");
    }
  }
  

  @GrpcMethod(ORDER_SERVICE_NAME)
  async updateOrder(request: UpdateOrderRequest,metadata?: Metadata,): Promise<Order> {
    const id = request.id;
    try {
      const update = await this.appService.UpdateOrder(id, request.order);
      return update;
    } catch (error) {
      throw new RpcException("Erreur lors de la mise à jour de la commande.");
    }
  }
  

  @GrpcMethod(ORDER_SERVICE_NAME)
  async deleteOrder(request: DeleteOrderRequest, metadata?: Metadata): Promise<Order> {
    const id = request.id;
  
    try {
      await this.appService.deleteOrder(id);
      return { id };
    } catch (error) {
      throw new RpcException("Erreur lors de la suppression de la commande.");
    }
  }
}
