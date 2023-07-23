import * as Joi from 'joi';

import { ConfigModule, ConfigService } from '@nestjs/config';
import grpcOption, { userGrpcOptions } from './config/grpc.option';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { USER_V1ALPHA_PACKAGE_NAME } from './stubs/user/v1alpha/user';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './config/winston.config';

const envSchema = Joi.object({
  PORT: Joi.number().default(3002),
  USER_API_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  insecure: Joi.boolean().required(),
  AUTH_CERT: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  AUTH_KEY: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  ROOT_CA: Joi.string().when('insecure', {
    is: false,
    then: Joi.required(),
  }),
  JAEGER_URL: Joi.string().required(),
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
          //console.log('UserService has been registered, options are', options);
          return options;
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
