import { GrpcOptions, Transport } from '@nestjs/microservices';

import { AUTH_V1ALPHA_PACKAGE_NAME } from './stubs/auth/v1alpha/auth';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:3002',
    package: AUTH_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, '../../../proto/auth/v1alpha/auth.proto'),
  },
}) as GrpcOptions;
