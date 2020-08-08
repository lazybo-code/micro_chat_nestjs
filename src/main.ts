import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setLicense('lazybo', 'https://lazybo.com')
      .setTitle('chat')
      .setDescription('The chat API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('api-doc', app, document);
  return app;
}

// 测试远程自动同步
const port = process.env.port || 46632;

bootstrap()
.then(app => app.listen(port))
.then(() => {
  const network = os.networkInterfaces();
  for(const net in network) {
    const info = network[net].find(v => v.family === 'IPv4');
    if (info != null) {
      console.log(`[nest] network: http://${info.address}:${port}`);
    }
  }
});
