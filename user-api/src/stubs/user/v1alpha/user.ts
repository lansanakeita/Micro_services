/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user.v1alpha";

export interface User {
  id?: number | undefined;
  username?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
  status?: ResponseStatus | undefined;
}

export interface FindRequest {
  id?: number | undefined;
  username?: string | undefined;
}

export interface FindResponse {
  users?: User[] | undefined;
  status?: ResponseStatus | undefined;
}

export interface ResponseStatus {
  code?: number | undefined;
  message?: string | undefined;
}

export interface RegisterRequest {
  username?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
}

export interface RegisterResponse {
  user?: User | undefined;
  status?: ResponseStatus | undefined;
}

export interface UpdateUserRequest {
  id?: number | undefined;
  user?: User | undefined;
}

export interface UpdateUserResponse {
  user?: User | undefined;
  status?: ResponseStatus | undefined;
}

export interface DeleteUserRequest {
  id?: number | undefined;
}

export interface DeleteUserResponse {
  id?: number | undefined;
  user?: User | undefined;
  status?: ResponseStatus | undefined;
}

export interface Empty {
}

export const USER_V1ALPHA_PACKAGE_NAME = "user.v1alpha";

export interface UserServiceClient {
  find(request: FindRequest, metadata?: Metadata): Observable<FindResponse>;

  register(request: RegisterRequest, metadata?: Metadata): Observable<RegisterResponse>;

  updateUser(request: UpdateUserRequest, metadata?: Metadata): Observable<UpdateUserResponse>;

  deleteUser(request: DeleteUserRequest, metadata?: Metadata): Observable<DeleteUserResponse>;
}

export interface UserServiceController {
  find(request: FindRequest, metadata?: Metadata): Promise<FindResponse> | Observable<FindResponse> | FindResponse;

  register(
    request: RegisterRequest,
    metadata?: Metadata,
  ): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  updateUser(
    request: UpdateUserRequest,
    metadata?: Metadata,
  ): Promise<UpdateUserResponse> | Observable<UpdateUserResponse> | UpdateUserResponse;

  deleteUser(
    request: DeleteUserRequest,
    metadata?: Metadata,
  ): Promise<DeleteUserResponse> | Observable<DeleteUserResponse> | DeleteUserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["find", "register", "updateUser", "deleteUser"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
