import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const configService = app.get(ConfigService);

  // use global pipes for request body validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // build swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Scam Report Service')
    .setDescription('Rest interface for reporting scam.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);


  const PORT = configService.get<number>('port');
  console.log(`app listening on port: ${PORT}`)
  await app.listen(PORT);
}
bootstrap();
