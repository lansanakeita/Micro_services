import { AUTH_SERVICE_NAME } from 'src/stubs/auth/v1alpha/auth';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { authGrpcOptions } from 'src/config/grpc.option';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: AUTH_SERVICE_NAME,
        useFactory: (cs: ConfigService) => authGrpcOptions(cs),
      },
    ]),
  ],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
