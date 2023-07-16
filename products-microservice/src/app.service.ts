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
        description: product.description,
        price: product.price,
      },
    });
  }


  async UpdateProduct(id: number, product: Prisma.ProductUpdateInput): Promise<Product> {
    try {
      return this.prisma.product.update({
        where: { id },
        data: {
          description: product.description,
          price: product.price,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('An error occurred while updating the product.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async DeleteProduct(id: number): Promise<Product> {
  //   try {
  //     return this.prisma.product.delete({
  //       where: { id: Number(id)},
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException('An error occurred while deleting the product.', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async deleteProduct(id: number): Promise<void> {
  //   try {
  //     await this.prisma.product.delete({
  //       where: { id },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException('Une erreur s\'est produite lors de la suppression du produit.', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
    
  }
}
