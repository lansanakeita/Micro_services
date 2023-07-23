import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Product } from 'src/stubs/product/v1alpha/product';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async findProductById(id: number): Promise<Product> {
    const product = this.prisma.product.findUnique({
      where: { id },
    });
    return product;
  }

  async createProduct(product: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
      },
    });
  }

  async updateProduct(
    id: number,
    product: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    try {
      return this.prisma.product.update({
        where: { id },
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'An error occurred while updating the product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
