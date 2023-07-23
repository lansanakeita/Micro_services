import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';

import { AUTH_V1ALPHA_PACKAGE_NAME } from 'src/stubs/auth/v1alpha/auth';
import { ConfigService } from '@nestjs/config';
import { PRODUCT_V1ALPHA_PACKAGE_NAME } from 'src/stubs/product/v1alpha/product';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import { readFileSync } from 'fs';

export default (cs: ConfigService) =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: PRODUCT_V1ALPHA_PACKAGE_NAME,
      url: `0.0.0.0:${cs.get('PORT') || 3003}`,
      credentials: !cs.get<boolean>('insecure')
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(cs.get('PRODUCT_KEY')),
              cert_chain: readFileSync(cs.get('PRODUCT_CERT')),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../../proto/product/v1alpha/product.proto')],
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
            readFileSync(cs.get('PRODUCT_KEY')),
            readFileSync(cs.get('PRODUCT_CERT')),
          )
        : ChannelCredentials.createInsecure(),
    },
  };
};
