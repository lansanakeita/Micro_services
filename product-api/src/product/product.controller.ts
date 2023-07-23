import { Controller, HttpStatus, UseGuards } from '@nestjs/common';
import {
  CreateProductRequest,
  CreateProductResponse,
  DeleteProductRequest,
  DeleteProductResponse,
  FindProductRequest,
  FindProductResponse,
  PRODUCT_SERVICE_NAME,
  Product,
  ProductServiceController,
  ProductServiceControllerMethods,
  UpdateProductRequest,
  UpdateProductResponse,
} from 'src/stubs/product/v1alpha/product';

import { AuthApiGuard } from 'src/auth/auth.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { ProductService } from './product.service';

@Controller()
@ProductServiceControllerMethods()
export class ProductController implements ProductServiceController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthApiGuard)
  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async findProduct(
    request: FindProductRequest,
    metadata?: Metadata,
  ): Promise<FindProductResponse> {
    const id = request.id;
    try {
      if (id) {
        const product = await this.productService.findProductById(id);
        if (!product) {
          return {
            products: null,
            status: {
              code: HttpStatus.NOT_FOUND,
              message: `User with ID ${id} not found`,
            },
          };
        }
        return {
          products: [product],
          status: {
            code: HttpStatus.OK,
            message: `The product with id ${product.id} has been successfully retrieved.`,
          },
        };
      } else {
        const products = await this.productService.findProducts();
        return {
          products,
          status: {
            code: HttpStatus.OK,
            message: 'All products were successfully recovered',
          },
        };
      }
    } catch (error) {
      return {
        products: null,
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error,
        },
      };
    }
  }

  formatPrice(price: number): string {
    const priceStr = price.toString();
    const decimalIndex = priceStr.indexOf('.');

    if (decimalIndex === -1) {
      return priceStr + '.00';
    }
    return priceStr.slice(0, decimalIndex + 3);
  }

  @UseGuards(AuthApiGuard)
  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async createProduct(
    request: CreateProductRequest,
    metadata?: Metadata,
  ): Promise<CreateProductResponse> {
    try {
      const productName: string = request.name;
      const productDescription: string = request.description;
      const price: number = request.price;
      const productPrice: string = this.formatPrice(price);
      const newProduct: Product = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
      };
      const product = await this.productService.createProduct(
        newProduct as any,
      );
      return {
        product,
        status: {
          code: HttpStatus.CREATED,
          message: `Product ${product.name} was created successfully`,
        },
      };
    } catch (error) {
      return {
        product: null,
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error,
        },
      };
    }
  }

  @UseGuards(AuthApiGuard)
  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async updateProduct(
    request: UpdateProductRequest,
    metadata?: Metadata,
  ): Promise<UpdateProductResponse> {
    const id = request.id;
    try {
      if (id) {
        const updateProduct = await this.productService.updateProduct(
          id,
          request.product,
        );
        return {
          product: updateProduct,
          status: {
            code: HttpStatus.OK,
            message: `Product ${updateProduct.name} has been updated successfully`,
          },
        };
      }
    } catch (error) {
      return {
        product: null,
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error,
        },
      };
    }
  }

  @UseGuards(AuthApiGuard)
  @GrpcMethod(PRODUCT_SERVICE_NAME)
  async deleteProduct(
    request: DeleteProductRequest,
    metadata?: Metadata,
  ): Promise<DeleteProductResponse> {
    const id = request.id;

    try {
      if (id) {
        const product = await this.productService.deleteProduct(id);
        return {
          product,
          status: {
            code: HttpStatus.BAD_GATEWAY,
            message: `Product ${product.name} has been deleted successfully`,
          },
        };
      }
    } catch (error) {
      return {
        product: null,
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error,
        },
      };
    }
  }
}
