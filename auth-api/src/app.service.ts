import {
  FindRequest,
  FindResponse,
  USER_SERVICE_NAME,
  USER_V1ALPHA_PACKAGE_NAME,
  User,
  UserServiceClient,
} from './stubs/user/v1alpha/user';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { OnModuleInit } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import {
  LoginRequest,
  LoginResponse,
  ValidateRequest,
  ValidateResponse,
} from './stubs/auth/v1alpha/auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject(USER_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc,
    private jwtService: JwtService,
  ) {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    console.log(
      'onModuleInit has been called, this.userService is',
      this.userService,
    );
  }

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    console.log(
      'onModuleInit has been called, this.userService is',
      this.userService,
    );
  }

  async findUser(req: FindRequest, md: Record<string, any>): Promise<User> {
    const meta = new Metadata();
    Object.entries(md).map(([k, v]) => meta.add(k, v));
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req, meta) as any,
    );

    return res.users?.[0];
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    if (!this.userService) {
      throw new Error('Service is not initialized');
    }
    const username = request.username;
    const findRequest: FindRequest = { username };

    const usersObservable = this.userService.find(findRequest);
    const users = await firstValueFrom(usersObservable);

    if (users.status && users.status.code === HttpStatus.NOT_FOUND) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['User not found.'],
        token: 'No token generated.',
      };
    }

    const user = users.users[0];

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['User not found.'],
        token: 'No token generated.',
      };
    }

    const plainPassword = request.password;
    const hashPassword = user.password;
    const passwordMatch = await bcrypt.compare(plainPassword, hashPassword);

    if (!passwordMatch) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid credentials.'],
        token: 'No token generated.',
      };
    }

    const payload = { userId: user.id };
    const token = await this.jwtService.signAsync(payload);

    return { status: HttpStatus.OK, error: [], token };
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
