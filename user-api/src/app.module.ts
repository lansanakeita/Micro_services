import * as Joi from 'joi';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import grpcOption from './config/grpc.option';
import winstonConfig from './config/winston.config';

const envSchema = Joi.object({
  DATABASE_URL_USER_API: Joi.string().required(),
  PORT: Joi.number().default(3001),
  insecure: Joi.boolean().required(),
  USER_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  USER_KEY: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  DATABASE_URL_AUTH_API: Joi.string().required(),
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
    UserModule,
    AuthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
