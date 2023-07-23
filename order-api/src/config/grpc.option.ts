import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';

import { AUTH_V1ALPHA_PACKAGE_NAME } from 'src/stubs/auth/v1alpha/auth';
import { ConfigService } from '@nestjs/config';
import { ORDER_V1ALPHA_PACKAGE_NAME } from 'src/stubs/order/v1alpha/order';
import { PRODUCT_V1ALPHA_PACKAGE_NAME } from 'src/stubs/product/v1alpha/product';
import { USER_V1ALPHA_PACKAGE_NAME } from 'src/stubs/user/v1alpha/user';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import { readFileSync } from 'fs';

export default (cs: ConfigService) =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: ORDER_V1ALPHA_PACKAGE_NAME,
      url: `0.0.0.0:${cs.get('PORT') || 3004}`,
      credentials: !cs.get<boolean>('insecure')
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(cs.get('ORDER_KEY')),
              cert_chain: readFileSync(cs.get('ORDER_CERT')),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../../proto/order/v1alpha/order.proto')],
    },
  } as GrpcOptions);

export const authGrpcOptions = (cs: ConfigService): ClientProviderOptions => {
  return {
    name: AUTH_V1ALPHA_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
      url: cs.get('AUTH_API_URL'),
      package: AUTH_V1ALPHA_PACKAGE_NAME,
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../../proto/auth/v1alpha/auth.proto')],
      keepalive: {
        // Send keepalive pings every 10 seconds, default is 2 hours.
        keepaliveTimeMs: 10 * 1000,
        // Keepalive ping timeout after 5 seconds, default is 20 seconds.
        keepaliveTimeoutMs: 5 * 1000,
        // Allow keepalive pings when there are no gRPC calls.
        keepalivePermitWithoutCalls: 1,
      },
      credentials: !cs.get<boolean>('insecure')
        ? ChannelCredentials.createSsl(
            readFileSync(cs.get('ROOT_CA')),
            readFileSync(cs.get('ORDER_KEY')),
            readFileSync(cs.get('ORDER_CERT')),
          )
        : ChannelCredentials.createInsecure(),
    },
  };
};

export const userGrpcOptions = (cs: ConfigService): ClientProviderOptions => {
  return {
    name: USER_V1ALPHA_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
      url: cs.get('USER_API_URL'),
      package: USER_V1ALPHA_PACKAGE_NAME,
      protoPath: join(__dirname, '../../proto/user/v1alpha/user.proto'),
      credentials: !cs.get<boolean>('insecure')
        ? ChannelCredentials.createSsl(
            readFileSync(cs.get('ROOT_CA')),
            readFileSync(cs.get('ORDER_KEY')),
            readFileSync(cs.get('ORDER_CERT')),
          )
        : ChannelCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
    },
  };
};

export const productGrpcOptions = (
  cs: ConfigService,
): ClientProviderOptions => {
  return {
    name: PRODUCT_V1ALPHA_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
      url: cs.get('PRODUCT_API_URL'),
      package: PRODUCT_V1ALPHA_PACKAGE_NAME,
      protoPath: join(__dirname, '../../proto/product/v1alpha/product.proto'),
      credentials: !cs.get<boolean>('insecure')
        ? ChannelCredentials.createSsl(
            readFileSync(cs.get('ROOT_CA')),
            readFileSync(cs.get('ORDER_KEY')),
            readFileSync(cs.get('ORDER_CERT')),
          )
        : ChannelCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
    },
  };
};
