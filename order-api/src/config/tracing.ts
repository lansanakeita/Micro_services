import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';

import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

registerInstrumentations({
  instrumentations: [
    new WinstonInstrumentation(),
    new GrpcInstrumentation(),
    new PrismaInstrumentation(),
  ],
});

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: `${process.env.npm_package_name}-${process.env.NODE_ENV}`,
  [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
});

const provider = new NodeTracerProvider({
  resource,
});

const exporter = new OTLPTraceExporter({
  url: process.env.JAEGER_URL || 'http://localhost:4318/v1/traces',
});
const spanProcessor = new SimpleSpanProcessor(exporter);
provider.addSpanProcessor(spanProcessor as any);
provider.register();

process.on('SIGTERM', () => {
  provider
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
