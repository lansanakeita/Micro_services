import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { grpcConfig } from './grpc.config';

async function validateEnvVars(configService: ConfigService) {
  const requiredEnvVars = ['JWT_SECRET'];

  requiredEnvVars.forEach((varName) => {
    if (!configService.get(varName)) {
      throw new Error(`Missing environment variable: ${varName}`);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  validateEnvVars(configService);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      grpcConfig,
    );

  await microservice.listen();
}

bootstrap();
