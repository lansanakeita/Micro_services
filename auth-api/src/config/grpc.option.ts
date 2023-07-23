import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';

import { AUTH_V1ALPHA_PACKAGE_NAME } from 'src/stubs/auth/v1alpha/auth';
import { ConfigService } from '@nestjs/config';
import { USER_V1ALPHA_PACKAGE_NAME } from 'src/stubs/user/v1alpha/user';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import { readFileSync } from 'fs';

export default (cs: ConfigService): GrpcOptions => {
  return addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: AUTH_V1ALPHA_PACKAGE_NAME,
      url: `0.0.0.0:${cs.get('PORT')}`,
      credentials: !cs.get<boolean>('insecure')
        ? ServerCredentials.createSsl(null, [
            {
              private_key: readFileSync(cs.get('AUTH_KEY')),
              cert_chain: readFileSync(cs.get('AUTH_CERT')),
            },
          ])
        : ServerCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
      protoPath: [join(__dirname, '../../proto/auth/v1alpha/auth.proto')],
    },
  });
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
            readFileSync(cs.get('AUTH_KEY')),
            readFileSync(cs.get('AUTH_CERT')),
          )
        : ChannelCredentials.createInsecure(),
      loader: {
        includeDirs: [join(__dirname, '../proto')],
      },
    },
  };
};
