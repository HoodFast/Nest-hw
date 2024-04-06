import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostService } from './posts/posts.service';
import { PostsRepository } from './posts/posts.repository';

@Module({
  imports: [],
  controllers: [AppController, PostsController],
  providers: [AppService, PostService, PostsRepository],
})
export class AppModule {}
