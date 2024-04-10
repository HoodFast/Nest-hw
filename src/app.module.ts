import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/api/posts.controller';
import { PostService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { Blog, BlogSchema } from './blogs/domain/blog.schema';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query.repository';
import { BlogService } from './blogs/application/blogs.service';
import { Post, PostSchema } from './posts/domain/post.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [AppController, PostsController, BlogsController],
  providers: [
    AppService,
    PostService,
    PostsRepository,
    BlogService,
    BlogsRepository,
    BlogsQueryRepository,
  ],
})
export class AppModule {}
