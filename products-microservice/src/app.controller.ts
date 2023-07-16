import { Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';
import { Product, GetProductResponse, CreateProductRequest, UpdateProductRequest, DeleteProductRequest, PRODUCT_SERVICE_NAME, ProductServiceController,
  ProductServiceControllerMethods, GetProductRequest } from './stubs/product/v1alpha/product';
import { Metadata } from "@grpc/grpc-js";
import {RpcException} from "@nestjs/microservices/exceptions";
import {GrpcMethod} from "@nestjs/microservices";


@Controller()
@ProductServiceControllerMethods()
export class AppController implements ProductServiceController{

  constructor( private readonly appService: AppService) {
  }
  
  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async getProducts(
    request: GetProductRequest,
    metadata?: Metadata,
  ): Promise<GetProductResponse>{
    try{
      const products = await this.appService.GetProducts();
      return {products};
    }catch(error){
      throw new RpcException("erreur de la récupération des éléments");
    }
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async createProduct(request: CreateProductRequest, metadata?: Metadata): Promise<Product>{
    try{
      const product = await this.appService.CreateProduct(request as any);
      return product;
    }catch(error){
      throw new RpcException("erreur de la création du produit");
    }
  }
  

  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async updateProduct(request: UpdateProductRequest,metadata?: Metadata,): Promise<Product> {
    const id = request.id;
    try {
      const updatedProduct = await this.appService.UpdateProduct(id, request.product);
      return updatedProduct;
    } catch (error) {
      throw new RpcException("Erreur lors de la mise à jour du produit.");
    }
  }
  

  @GrpcMethod(PRODUCT_SERVICE_NAME)
  // async deleteProduct(request: DeleteProductRequest, metadata?: Metadata): Promise<Product>{
  //   const product:Product = {
  //     description: "chaise 40x30",
  //     price: 65
  //   }
  //   return product;
  // }

  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async deleteProduct(request: DeleteProductRequest, metadata?: Metadata): Promise<Product> {
    const id = request.id;
  
    try {
      await this.appService.deleteProduct(id);
      return { id };
    } catch (error) {
      throw new RpcException("Erreur lors de la suppression du produit.");
    }
  }
  
}
