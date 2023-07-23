/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "product.v1alpha";

export interface Product {
  id?: number | undefined;
  name?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
}

export interface FindProductRequest {
  id?: number | undefined;
}

export interface FindProductResponse {
  products?: Product[] | undefined;
  status?: ResponseStatus | undefined;
}

export interface CreateProductRequest {
  name?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
}

export interface CreateProductResponse {
  product?: Product | undefined;
  status?: ResponseStatus | undefined;
}

export interface UpdateProductRequest {
  id?: number | undefined;
  product?: Product | undefined;
}

export interface UpdateProductResponse {
  product?: Product | undefined;
  status?: ResponseStatus | undefined;
}

export interface DeleteProductRequest {
  id?: number | undefined;
}

export interface DeleteProductResponse {
  product?: Product | undefined;
  status?: ResponseStatus | undefined;
}

export interface ResponseStatus {
  code?: number | undefined;
  message?: string | undefined;
}

export interface Empty {
}

export const PRODUCT_V1ALPHA_PACKAGE_NAME = "product.v1alpha";

export interface ProductServiceClient {
  findProduct(request: FindProductRequest, metadata?: Metadata): Observable<FindProductResponse>;

  createProduct(request: CreateProductRequest, metadata?: Metadata): Observable<CreateProductResponse>;

  updateProduct(request: UpdateProductRequest, metadata?: Metadata): Observable<UpdateProductResponse>;

  deleteProduct(request: DeleteProductRequest, metadata?: Metadata): Observable<DeleteProductResponse>;
}

export interface ProductServiceController {
  findProduct(
    request: FindProductRequest,
    metadata?: Metadata,
  ): Promise<FindProductResponse> | Observable<FindProductResponse> | FindProductResponse;

  createProduct(
    request: CreateProductRequest,
    metadata?: Metadata,
  ): Promise<CreateProductResponse> | Observable<CreateProductResponse> | CreateProductResponse;

  updateProduct(
    request: UpdateProductRequest,
    metadata?: Metadata,
  ): Promise<UpdateProductResponse> | Observable<UpdateProductResponse> | UpdateProductResponse;

  deleteProduct(
    request: DeleteProductRequest,
    metadata?: Metadata,
  ): Promise<DeleteProductResponse> | Observable<DeleteProductResponse> | DeleteProductResponse;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findProduct", "createProduct", "updateProduct", "deleteProduct"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_SERVICE_NAME = "ProductService";
