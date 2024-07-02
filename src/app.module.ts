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
import { PostsQueryRepository } from './posts/infrastructure/posts.query.repository';
import { Comment, CommentSchema } from './comments/domain/comment.schema';
import { User, UsersSchema } from './users/domain/user.schema';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/users.query.repository';
import { TestingQueryRepository } from './testing/infrastructure/testing.query.repository';
import { UsersController } from './users/api/users.controller';
import { TestingController } from './testing/api/testing.controller';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query.repository';
import { AuthService } from './auth/application/auth.service';
import { JwtService } from './auth/infrastructure/jwt.service';
import { SessionRepository } from './sessions/infrastructure/session.repository';
import { AuthController } from './auth/api/auth.controller';
import { Session, SessionSchema } from './sessions/domain/session.schema';
import { EmailService } from './auth/infrastructure/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';
import configuration, {
  ConfigServiceType,
  validate,
} from './settings/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './blogs/api/use-cases/create-blog.usecase';
import { CreatePostForBlogUseCase } from './posts/api/use-cases/create-post-for-blog.usecase';
import { UpdateBlogUseCase } from './blogs/api/use-cases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/api/use-cases/delete-blog.usecase';
import { UpdatePostUseCase } from './posts/api/use-cases/update-post.usecase';
import { UpdateLikesUseCase } from './posts/api/use-cases/update-likes.usecase';
import { GetCommentUseCase } from './comments/api/use-cases/get-comment-by-id.usecase';
import { CreateCommentForPostUseCase } from './posts/api/use-cases/create-comment-for-post.usecase';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import {
  UpdateCommentLikesCommand,
  UpdateCommentLikesUseCase,
} from './comments/api/use-cases/update-comment-like-status.usecase';
import { CommentsController } from './comments/api/comments.controller';

const useCases = [
  CreateBlogUseCase,
  CreatePostForBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  UpdateBlogUseCase,
  UpdatePostUseCase,
  UpdateLikesUseCase,
  GetCommentUseCase,
  CreateCommentForPostUseCase,
  UpdateCommentLikesUseCase,
];
// const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/nest';
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      // ignoreEnvFile:
      //   process.env.ENV !== Environments.DEVELOPMENT &&
      //   process.env.ENV !== Environments.TEST,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigServiceType) => {
        const databaseSettings = configService.get('databaseSettings', {
          infer: true,
        });
        const environmentSettings = configService.get('environmentSettings', {
          infer: true,
        });
        const uri = environmentSettings?.isTesting
          ? databaseSettings?.MONGO_CONNECTION_URI_FOR_TESTS
          : databaseSettings?.MONGO_CONNECTION_URI;
        return { uri: uri };
      },

      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [
    AppController,
    PostsController,
    BlogsController,
    UsersController,
    TestingController,
    AuthController,
    CommentsController,
  ],
  providers: [
    AppService,
    PostService,
    PostsRepository,
    PostsQueryRepository,
    BlogService,
    BlogsRepository,
    BlogsQueryRepository,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    TestingQueryRepository,
    CommentsQueryRepository,
    CommentsRepository,
    AuthService,
    JwtService,
    SessionRepository,
    AuthService,
    EmailService,
    UsersService,
    ConfigService,
    ...useCases,
  ],
})
export class AppModule {}
