import {
  AuthServiceController,
  AuthServiceControllerMethods,
  AUTH_SERVICE_NAME,
  LoginRequest,
  LoginResponse,
  ValidateRequest,
  ValidateResponse,
} from './stubs/auth/v1alpha/auth';
import { Controller, Inject } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';

import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'winston';
import { Observable } from 'rxjs';
import { GrpcMethod } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
@AuthServiceControllerMethods()
export class AppController implements AuthServiceController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
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
      this.logger.error('Error in AppService.login:', error);
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
