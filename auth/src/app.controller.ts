import {
  AUTH_SERVICE_NAME,
  AuthServiceController,
  AuthServiceControllerMethods,
  LoginRequest,
  LoginResponse,
  ValidateRequest,
  ValidateResponse,
} from './stubs/auth/v1alpha/auth';

import { AppService } from './app.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AppController implements AuthServiceController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @GrpcMethod(AUTH_SERVICE_NAME)
  async login(
    request: LoginRequest,
    metadata?: Metadata,
  ): Promise<LoginResponse> {
    try {
      const authResponse = await this.appService.login(request);
      return authResponse;
    } catch (error) {
      throw new Error(error);
    }
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  validate(
    request: ValidateRequest,
    metadata?: Metadata,
  ):
    | ValidateResponse
    | Promise<ValidateResponse>
    | Observable<ValidateResponse> {
    const checkResponse = this.appService.validate(request);
    return checkResponse;
  }
}
