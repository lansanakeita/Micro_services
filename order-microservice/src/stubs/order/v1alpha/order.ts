/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "order.v1alpha";

export interface Order {
  id?: number | undefined;
  idProduct?: number | undefined;
  quantityProduct?: number | undefined;
}

export interface GetOrderRequest {
  id?: number | undefined;
  idProduct?: number | undefined;
  quantityProduct?: number | undefined;
}

export interface GetOrderResponse {
  orders?: Order[] | undefined;
}

export interface CreateOrderRequest {
  idProduct?: number | undefined;
  quantityProduct?: number | undefined;
}

export interface UpdateOrderRequest {
  id?: number | undefined;
  order?: Order | undefined;
}

export interface DeleteOrderRequest {
  id?: number | undefined;
}

export interface Empty {
}

export const ORDER_V1ALPHA_PACKAGE_NAME = "order.v1alpha";

export interface OrderServiceClient {
  getOrders(request: GetOrderRequest, metadata?: Metadata): Observable<GetOrderResponse>;

  createOrder(request: CreateOrderRequest, metadata?: Metadata): Observable<Order>;

  updateOrder(request: UpdateOrderRequest, metadata?: Metadata): Observable<Order>;

  deleteOrder(request: DeleteOrderRequest, metadata?: Metadata): Observable<Order>;
}

export interface OrderServiceController {
  getOrders(
    request: GetOrderRequest,
    metadata?: Metadata,
  ): Promise<GetOrderResponse> | Observable<GetOrderResponse> | GetOrderResponse;

  createOrder(request: CreateOrderRequest, metadata?: Metadata): Promise<Order> | Observable<Order> | Order;

  updateOrder(request: UpdateOrderRequest, metadata?: Metadata): Promise<Order> | Observable<Order> | Order;

  deleteOrder(request: DeleteOrderRequest, metadata?: Metadata): Promise<Order> | Observable<Order> | Order;
}

export function OrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getOrders", "createOrder", "updateOrder", "deleteOrder"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ORDER_SERVICE_NAME = "OrderService";
