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
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/auth-service': '',
    },
  }));

  // Media Service
  app.use('/media-service', createProxyMiddleware({
    target: process.env.MEDIA_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/media-service': '',
    },
    router: function (req: any) {
      console.log(req.url);
      if (req.url.includes('assets')) {
        // change target
        return process.env.MEDIA_SERVICE_URL.replace('/api/v1', '')
      }
    }
  }));

  const config = new DocumentBuilder()
    .setTitle('Mahestore API')
    .setDescription('The Mahestore API description')
    .setVersion('1.0')
    .addTag('Auth', 'Products')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
