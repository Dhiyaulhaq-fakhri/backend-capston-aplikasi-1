import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { LoggerMiddleware } from './common/logger/logger.middleware.js';
import { AuthModule } from './auth/auth.module.js';
import { FarmersModule } from './farmers/farmers.module.js';
import { LivestockModule } from './livestock/livestock.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      envFilePath: process.env.ENV_FILE || '.env',
    }),
    
    // TypeOrmModule
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.getOrThrow<string>('DB_HOST'),
        port: cfg.getOrThrow<number>('DB_PORT'),
        username: cfg.getOrThrow<string>('DB_USER'),
        password: cfg.getOrThrow<string>('DB_PASS'),
        database: cfg.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // HANYA development!
      }),
    }),
    
    UsersModule,
    AuthModule,
    FarmersModule,
    LivestockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}