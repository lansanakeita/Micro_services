import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Product } from './product.model';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class AppService {
  private products: Product[] = [];
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async create(product: Product): Promise<Product> {
    return this.prisma.product.create({
      data: {
        description: product.description,
        price: product.price,
      },
    });
  }
  
  async update(id: number, product: Product): Promise<Product> {
    try {
      return this.prisma.product.update({
        where: { id: Number(id) },
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

  async delete(id: number): Promise<Product> {
    try {
      return this.prisma.product.delete({
        where: { id: Number(id)},
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('An error occurred while deleting the product.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
