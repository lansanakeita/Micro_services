import { GrpcOptions, Transport } from '@nestjs/microservices';

import { ORDER_V1ALPHA_PACKAGE_NAME } from './stubs/order/v1alpha/order';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:3004',
    package: ORDER_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, '../../../proto/order/v1alpha/order.proto'),
  },
}) as GrpcOptions;
