/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "product.v1alpha";

export interface Product {
  id?: number | undefined;
  description?: string | undefined;
  price?: number | undefined;
}

export interface GetProductRequest {
  id?: number | undefined;
  description?: string | undefined;
}

export interface GetProductResponse {
  products?: Product[] | undefined;
}

export interface CreateProductRequest {
  description?: string | undefined;
  price?: number | undefined;
}

export interface UpdateProductRequest {
  id?: number | undefined;
  product?: Product | undefined;
}

export interface DeleteProductRequest {
  id?: number | undefined;
}

export interface Empty {
}

export const PRODUCT_V1ALPHA_PACKAGE_NAME = "product.v1alpha";

export interface ProductServiceClient {
  getProducts(request: GetProductRequest, metadata?: Metadata): Observable<GetProductResponse>;

  createProduct(request: CreateProductRequest, metadata?: Metadata): Observable<Product>;

  updateProduct(request: UpdateProductRequest, metadata?: Metadata): Observable<Product>;

  deleteProduct(request: DeleteProductRequest, metadata?: Metadata): Observable<Product>;
}

export interface ProductServiceController {
  getProducts(
    request: GetProductRequest,
    metadata?: Metadata,
  ): Promise<GetProductResponse> | Observable<GetProductResponse> | GetProductResponse;

  createProduct(request: CreateProductRequest, metadata?: Metadata): Promise<Product> | Observable<Product> | Product;

  updateProduct(request: UpdateProductRequest, metadata?: Metadata): Promise<Product> | Observable<Product> | Product;

  deleteProduct(request: DeleteProductRequest, metadata?: Metadata): Promise<Product> | Observable<Product> | Product;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getProducts", "createProduct", "updateProduct", "deleteProduct"];
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
