import * as Joi from 'joi';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProductModule } from './product/product.module';
import { WinstonModule } from 'nest-winston';
import grpcOption from './config/grpc.option';
import winstonConfig from './config/winston.config';

const envSchema = Joi.object({
  DATABASE_URL_PRODUCT_API: Joi.string().required(),
  PORT: Joi.number().default(3003),
  insecure: Joi.boolean().required(),
  PRODUCT_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  PRODUCT_KEY: Joi.string().when('insecure', {
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
    ProductModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
