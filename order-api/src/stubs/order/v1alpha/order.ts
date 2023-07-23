/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "order.v1alpha";

export interface Order {
  id?: number | undefined;
  userId?: number | undefined;
  productId?: number[] | undefined;
  quantity?: number[] | undefined;
}

export interface FindOrderRequest {
  id?: number | undefined;
  userId?: number | undefined;
}

export interface FindOrderResponse {
  orders?: Order[] | undefined;
  status?: ResponseStatus | undefined;
}

export interface CreateOrderRequest {
  userId?: number | undefined;
  productId?: number[] | undefined;
  quantity?: number[] | undefined;
}

export interface CreateOrderResponse {
  order?: Order | undefined;
  status?: ResponseStatus | undefined;
}

export interface UpdateOrderRequest {
  id?: number | undefined;
  order?: Order | undefined;
}

export interface UpdateOrderResponse {
  order?: Order | undefined;
  status?: ResponseStatus | undefined;
}

export interface DeleteOrderRequest {
  id?: number | undefined;
}

export interface DeleteOrderResponse {
  order?: Order | undefined;
  status?: ResponseStatus | undefined;
}

export interface ResponseStatus {
  code?: number | undefined;
  message?: string | undefined;
}

export interface Empty {
}

export const ORDER_V1ALPHA_PACKAGE_NAME = "order.v1alpha";

export interface OrderServiceClient {
  findOrder(request: FindOrderRequest, metadata?: Metadata): Observable<FindOrderResponse>;

  createOrder(request: CreateOrderRequest, metadata?: Metadata): Observable<CreateOrderResponse>;

  updateOrder(request: UpdateOrderRequest, metadata?: Metadata): Observable<UpdateOrderResponse>;

  deleteOrder(request: DeleteOrderRequest, metadata?: Metadata): Observable<DeleteOrderResponse>;
}

export interface OrderServiceController {
  findOrder(
    request: FindOrderRequest,
    metadata?: Metadata,
  ): Promise<FindOrderResponse> | Observable<FindOrderResponse> | FindOrderResponse;

  createOrder(
    request: CreateOrderRequest,
    metadata?: Metadata,
  ): Promise<CreateOrderResponse> | Observable<CreateOrderResponse> | CreateOrderResponse;

  updateOrder(
    request: UpdateOrderRequest,
    metadata?: Metadata,
  ): Promise<UpdateOrderResponse> | Observable<UpdateOrderResponse> | UpdateOrderResponse;

  deleteOrder(
    request: DeleteOrderRequest,
    metadata?: Metadata,
  ): Promise<DeleteOrderResponse> | Observable<DeleteOrderResponse> | DeleteOrderResponse;
}

export function OrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOrder", "createOrder", "updateOrder", "deleteOrder"];
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
