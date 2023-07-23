/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth.v1alpha";

export interface LoginRequest {
  username?: string | undefined;
  password?: string | undefined;
}

export interface LoginResponse {
  status?: number | undefined;
  error?: string[] | undefined;
  token?: string | undefined;
}

export interface ValidateRequest {
  token?: string | undefined;
}

export interface ValidateResponse {
  status?: number | undefined;
  error?: string[] | undefined;
  userId?: number | undefined;
}

export const AUTH_V1ALPHA_PACKAGE_NAME = "auth.v1alpha";

export interface AuthServiceClient {
  login(request: LoginRequest, metadata?: Metadata): Observable<LoginResponse>;

  validate(request: ValidateRequest, metadata?: Metadata): Observable<ValidateResponse>;
}

export interface AuthServiceController {
  login(request: LoginRequest, metadata?: Metadata): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  validate(
    request: ValidateRequest,
    metadata?: Metadata,
  ): Promise<ValidateResponse> | Observable<ValidateResponse> | ValidateResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
