import * as Joi from 'joi';

import { ConfigModule, ConfigService } from '@nestjs/config';
import grpcOption, {
  productGrpcOptions,
  userGrpcOptions,
} from './config/grpc.option';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { Module } from '@nestjs/common';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';
import { PRODUCT_V1ALPHA_PACKAGE_NAME } from './stubs/product/v1alpha/product';
import { PrismaService } from './prisma.service';
import { USER_V1ALPHA_PACKAGE_NAME } from './stubs/user/v1alpha/user';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './config/winston.config';

const envSchema = Joi.object({
  DATABASE_URL_ORDER_API: Joi.string().required(),
  PORT: Joi.number().default(3004),
  insecure: Joi.boolean().required(),
  ORDER_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  ORDER_KEY: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  ROOT_CA: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  JAEGER_URL: Joi.string(),
  AUTH_API_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: envSchema,
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => winstonConfig(cs),
    }),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    ClientsModule.registerAsync([
      {
        name: USER_V1ALPHA_PACKAGE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => {
          const options = userGrpcOptions(cs);
          return options;
        },
      },
      {
        name: PRODUCT_V1ALPHA_PACKAGE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => {
          const options = productGrpcOptions(cs);
          return options;
        },
      },
    ]),
    //OrderModule,
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class AppModule {}
