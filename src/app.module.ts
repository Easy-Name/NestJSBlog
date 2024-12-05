import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: ['.env.development'],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`, //Loads different environments based on different variables
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        //autoLoadEntities: true,
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        //entities: [User],
        synchronize: configService.get('database.synchronize'),
        //synchronize: true,
        //url: process.env.CONNECTION_STRING,
        //url: configService.get('CONNECTION_STRING'),
        url: configService.get('database.connectionString'),
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
