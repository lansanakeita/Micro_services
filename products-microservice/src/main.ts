import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {PRODUCT_V1ALPHA_PACKAGE_NAME} from "src/stubs/product/v1alpha/product";


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package:PRODUCT_V1ALPHA_PACKAGE_NAME,
        protoPath: join(__dirname, '../src/proto/product/v1alpha/product.proto'),
        url: 'localhost:3000',
      },
    },
  );

  await app.listen();
}
bootstrap();
