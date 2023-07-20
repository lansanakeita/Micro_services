import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {ORDER_V1ALPHA_PACKAGE_NAME} from "src/stubs/order/v1alpha/order";


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package:ORDER_V1ALPHA_PACKAGE_NAME,
        protoPath: join(__dirname, '../src/proto/order/v1alpha/order.proto'),
        url: 'localhost:3004',
      },
    },
  );

  await app.listen();
}
bootstrap();

