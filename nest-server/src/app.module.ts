import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ScamModule } from './scam/scam.module';
import { UserModule } from './user/user.module';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PerformanceMonitorInterceptor } from './interceptors/performance-monitor.interceptor';
import { SupportModule } from './support/support.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './app.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.host'),
      }),
      inject: [ConfigService],      
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/media/',
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    AuthModule,
    ScamModule, 
    UserModule, 
    SupportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceMonitorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
