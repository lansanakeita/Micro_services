import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';

import { AppService } from './app.service';
import { Product } from './product.model';

@Controller()
export class AppController {
  constructor( private readonly appService: AppService) {
  }
  

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('findAll') 
  async getAllProducts(): Promise<Product[]> {
    return this.appService.findAll();
  }
  


  @Post('create')
  create(@Body() product: Product): Promise<Product> {
    return this.appService.create(product);
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() product: Product,
  ): Promise<Product> {
    const updatedProduct = await this.appService.update(id, product);
    return updatedProduct;
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number): Promise<Product> {
    return this.appService.delete(id);
  }
}
