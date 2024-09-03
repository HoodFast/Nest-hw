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
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/api/auth.controller';
import { Session, SessionSchema } from './sessions/domain/session.schema';
import { EmailService } from './auth/infrastructure/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  ConfigServiceType,
  validate,
} from './settings/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './blogs/api/use-cases/create-blog.usecase';
import { UpdatePostUseCase } from './posts/api/use-cases/update-post.usecase';
import { CreatePostForBlogUseCase } from './posts/api/use-cases/create-post-for-blog.usecase';
import { UpdateBlogUseCase } from './blogs/api/use-cases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/api/use-cases/delete-blog.usecase';
import { UpdateLikesUseCase } from './posts/api/use-cases/update-likes.usecase';
import { GetCommentUseCase } from './comments/api/use-cases/get-comment-by-id.usecase';
import { CreateCommentForPostUseCase } from './posts/api/use-cases/create-comment-for-post.usecase';
import { UpdateCommentLikesUseCase } from './comments/api/use-cases/update-comment-like-status.usecase';
import { UpdateCommentBodyUseCase } from './comments/api/use-cases/update-comment-body.usecase';
import { DeleteCommentUseCase } from './comments/api/use-cases/delete-comment.usecase';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { SessionRepository } from './sessions/infrastructure/session.repository';
import { BlogExistsValidator } from './base/validate/blog.exist.validate';
import { SecurityController } from './sessions/api/security.controller';
import { SessionQueryRepository } from './sessions/infrastructure/session.query.repository';
import { DeleteAllSessionsUseCase } from './sessions/api/useCases/delete-all-sessions.usecase';
import { DeleteSessionByIdUseCase } from './sessions/api/useCases/delete-session-by-id.usecase';
import { GetAllSessionUseCase } from './sessions/api/useCases/get-all-sessions.usecase';
import { UsersSqlRepository } from './users/infrastructure/users.sql.repository';
import { UsersSqlQueryRepository } from './users/infrastructure/users.sql.query.repository';
import { SessionSqlQueryRepository } from './sessions/infrastructure/session.sql.query.repository';
import { SessionSqlRepository } from './sessions/infrastructure/session.sql.repository';
import { EmailConfirmation, Users } from './users/domain/user.sql.entity';

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
  UpdateCommentBodyUseCase,
  DeleteCommentUseCase,
  GetAllSessionUseCase,
  DeleteSessionByIdUseCase,
  DeleteAllSessionsUseCase,
];
// const repositories = [
//   PostsRepository,
//   PostsQueryRepository,
//   BlogsRepository,
//   BlogsQueryRepository,
//   UsersRepository,
//   UsersQueryRepository,
//   TestingQueryRepository,
//   CommentsQueryRepository,
//   CommentsRepository,
//   SessionRepository,
//   SessionQueryRepository,
// ];
// const services = [
//   AppService,
//   PostService,
//   BlogService,
//   UsersService,
//   AuthService,
//   JwtService,
//   AuthService,
//   EmailService,
//   UsersService,
//   ConfigService,
// ];
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigServiceType) => {
        const sqlDataBaseSettings = configService.get('sqlDataBaseSettings', {
          infer: true,
        });
        return {
          type: 'postgres',
          host: sqlDataBaseSettings?.SQL_HOST,
          username: sqlDataBaseSettings?.SQL_USERNAME,
          password: sqlDataBaseSettings?.SQL_PASS,
          database: 'superbase',
          ssl: true,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([EmailConfirmation]),
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
    // UsersController,
    TestingController,
    AuthController,
    CommentsController,
    SecurityController,
  ],
  providers: [
    UsersSqlRepository,
    UsersSqlQueryRepository,
    SessionSqlQueryRepository,
    SessionSqlRepository,
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
    SessionQueryRepository,
    AuthService,
    EmailService,
    UsersService,
    ConfigService,
    BlogExistsValidator,
    ...useCases,
  ],
})
export class AppModule {}
