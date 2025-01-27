import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.status(204).end(); // Respond with no content
    } else {
      next();
    }
  });


  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Legal AI API Documentation')
    .setDescription('This will contain all the endpoints for the Legal AI API')
    .setVersion('1.0')
    .addTag('Documentation')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
