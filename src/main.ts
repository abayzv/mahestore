import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');

  // Auth Service
  app.use('/auth-service', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL + ':' + process.env.AUTH_SERVICE_PORT,
    changeOrigin: true,
    pathRewrite: {
      '^/auth-service': '',
    },
  }));

  // render static html route /test


  // Media Service
  app.use('/media-service', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL + ':' + process.env.AUTH_SERVICE_PORT,
    changeOrigin: true,
    // rewrite target /api/v1/files to /media-service
    pathRewrite: {
      '^/media-service/assets': '/api/v1/files',
    },
  }));

  // Whatsapp Service
  app.use('/whatsapp-service', createProxyMiddleware({
    target: process.env.WHATSAPP_SERVICE_URL + ':' + process.env.WHATSAPP_SERVICE_PORT,
    changeOrigin: true,
    pathRewrite: {
      '^/whatsapp-service': '',
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Mahestore API')
    .setDescription('The Mahestore API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
