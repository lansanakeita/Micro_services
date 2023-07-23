import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from 'src/stubs/auth/v1alpha/auth';
import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';
import { ValidateResponse, ValidateRequest } from 'src/stubs/auth/v1alpha/auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private client: ClientGrpc,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  validate(request: ValidateRequest): ValidateResponse {
    try {
      const decoded = this.jwtService.verify(request.token);
      return { status: HttpStatus.OK, error: [], userId: decoded.userId };
    } catch (err) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid token.'],
        userId: undefined,
      };
    }
  }
}
