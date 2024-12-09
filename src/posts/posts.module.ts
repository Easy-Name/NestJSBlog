import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UsersService } from 'src/users/users.service';
import { TagsModule } from 'src/tags/tags.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService], //, UsersService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Post, MetaOption]),
    TagsModule,
    PaginationModule,
  ],
})
export class PostsModule {}
