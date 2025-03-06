import { APIGatewayEvent, Context, Callback, Handler, SQSEvent } from 'aws-lambda';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SalesLambdaService } from './sales-lambda/sales-lambda.service';

async function bootstrap(event: any, context: Context) {

  // * create NestJs application
  const app = await NestFactory.create(AppModule);
  const service = app.get(SalesLambdaService);

  const env = process.env.ENV.padEnd(20, ' ');

  console.log(`
╔═════════════════════════════╗
║ @org: Profaxno Company      ║
║ @app: siproad-sales-lambda ║
║ @env: ${env} ║
╚═════════════════════════════╝
`)

  // * process event
  console.log(`>>> siproad-sales-lambda: starting process... event=${JSON.stringify(event)}`);

  return service.processEvent(event)
  .then( (response) => {
    console.log('<<< siproad-sales-lambda: executed');
    return response;
  })
  .catch((error) => {
    console.log('siproad-sales-lambda: processing error', error);
    throw error;
  });
  
}

export const handler: Handler = bootstrap;