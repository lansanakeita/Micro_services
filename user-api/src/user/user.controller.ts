import { Controller, HttpStatus, UseGuards } from '@nestjs/common';
import {
  DeleteUserRequest,
  DeleteUserResponse,
  FindRequest,
  FindResponse,
  RegisterRequest,
  RegisterResponse,
  USER_SERVICE_NAME,
  UpdateUserRequest,
  UpdateUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '../stubs/user/v1alpha/user';

import { AuthApiGuard } from 'src/auth/auth.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { UserService } from './user.service';

@Controller()
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME)
  async find(request: FindRequest, metadata?: Metadata): Promise<FindResponse> {
    const id = request.id;
    const username = request.username;
    try {
      if (id) {
        const user = await this.userService.findById(id);
        if (!user) {
          return {
            users: [],
            status: {
              code: HttpStatus.NOT_FOUND,
              message: `User with ID ${id} not found`,
            },
          };
        }
        return { users: [user] };
      } else if (username) {
        const user = await this.userService.findUserByUsername(username);
        if (!user) {
          return {
            users: [],
            status: {
              code: HttpStatus.NOT_FOUND,
              message: `User with username ${username} not found`,
            },
          };
        }
        return { users: [user] };
      } else {
        const users = await this.userService.findAll();
        return { users };
      }
    } catch (error) {
      return {
        users: [],
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error,
        },
      };
    }
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async register(
    request: RegisterRequest,
    metadata?: Metadata,
  ): Promise<RegisterResponse> {
    try {
      const user = await this.userService.createUser(request as any);
      return { user };
    } catch (error) {
      return {
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error.toString(),
        },
      };
    }
  }

  @UseGuards(AuthApiGuard)
  @GrpcMethod(USER_SERVICE_NAME)
  async updateUser(
    request: UpdateUserRequest,
    metadata?: Metadata,
  ): Promise<UpdateUserResponse> {
    const id = request.id;
    try {
      Object.keys(request).forEach(
        (key) => request[key] === undefined && delete request[key],
      );

      delete request.id;
      const user = await this.userService.updateUser(id, request as any);
      return user;
    } catch (error) {
      return {
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error.toString(),
        },
      };
    }
  }

  @UseGuards(AuthApiGuard)
  @GrpcMethod(USER_SERVICE_NAME)
  async deleteUser(
    request: DeleteUserRequest,
    metadata?: Metadata,
  ): Promise<DeleteUserResponse> {
    try {
      const user = await this.userService.deleteUser(request as any);
      return user;
    } catch (error) {
      return {
        status: {
          code: HttpStatus.BAD_GATEWAY,
          message: error.toString(),
        },
      };
    }
  }
}
