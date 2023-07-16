import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Product } from './stubs/product/v1alpha/product';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';


@Injectable()
export class AppService {
  constructor( private readonly prisma:PrismaService) {
  }

  async GetProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async CreateProduct(product: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name:product.name,
        description: product.description,
        price: product.price,
        quantity:product.quantity
      },
    });
  }


  async UpdateProduct(id: number, product: Prisma.ProductUpdateInput): Promise<Product> {
    try {
      return this.prisma.product.update({
        where: { id },
        data: {
          name:product.name,
          description: product.description,
          price: product.price,
          quantity:product.quantity
          
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('An error occurred while updating the product.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
    
  }
}
