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

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/nest';
@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URL),
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
    AuthService,
    JwtService,
    SessionRepository,
    AuthService,
    EmailService,
    UsersService,
  ],
})
export class AppModule {}
