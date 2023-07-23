import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { USER_V1ALPHA_PACKAGE_NAME } from './stubs/user/v1alpha/user';
import { grpcConfig } from './grpc.config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GrpcReflectionModule.register(grpcConfig),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:3001',
          package: USER_V1ALPHA_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/user/v1alpha/user.proto'),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
