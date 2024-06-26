import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../application/posts.service';
import { Response } from 'express';
import { InputPostCreate } from './input/PostsCreate.dto';
import { QueryPostInputModel } from './input/PostsGetInput';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { sortDirection } from '../../blogs/api/blogs.controller';
import { AuthGuard } from '../../guards/auth.guard';
import {
  CommandCreatePostForBlogOutput,
  CreatePostForBlogCommand,
} from '../../blogs/api/use-cases/create-post-for-blog.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../base/models/Interlayer';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import {
  CommandUpdatePostOutputData,
  UpdatePostCommand,
} from './use-cases/update-post.usecase';
import { likesStatuses } from './input/likesDtos';
import { AccessTokenAuthGuard } from '../../guards/access.token.auth.guard';
import { UpdateLikesCommand } from './use-cases/update-likes.usecase';
import { UpdateOutputData } from '../../base/models/updateOutput';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostService,
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commandBus: CommandBus,
  ) {}
  @HttpCode(204)
  @UseGuards(AccessTokenAuthGuard)
  @Put(':id/like-status')
  async updateLikes(
    @Body() body: { likeStatus: likesStatuses },
    @Param('id') postId: string,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const userId = req.userId;
    const command = new UpdateLikesCommand(body.likeStatus, postId, userId);
    const updateLikes = await this.commandBus.execute<
      UpdateLikesCommand,
      InterlayerNotice<UpdateOutputData>
    >(command);
    if (updateLikes.hasError()) throw new NotFoundException();
    return;
  }

  @Get()
  async getAllPosts(@Query() query: QueryPostInputModel) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? sortDirection.desc,
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };
    const userId = '';
    const posts = await this.postService.getAllPosts(userId, sortData);

    return posts;
  }

  @Get(':id')
  async getPostById(
    @Param('id') postId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = '';
    const post = await this.postService.getPostById(userId, postId);

    if (!post) return res.sendStatus(404);
    return post;
  }
  @Get(':id/comments')
  async getCommentsForPost(
    @Param('id') postId: string,
    @Query() query: QueryPostInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? sortDirection.desc,
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };
    const userId = '';
    const comments = await this.commentsQueryRepository.getAllByPostId(
      userId,
      postId,
      sortData,
    );
    if (!comments) return res.sendStatus(404);
    return comments;
  }
  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body() body: InputPostCreate) {
    const command = new CreatePostForBlogCommand(
      body.title,
      body.shortDescription,
      body.content,
      body.blogId,
    );

    // const userId = '';
    const creatingPost = await this.commandBus.execute<
      CreatePostForBlogCommand,
      InterlayerNotice<CommandCreatePostForBlogOutput>
    >(command);
    if (creatingPost.hasError())
      throw new NotFoundException(creatingPost.extensions[0].message);
    const post = await this.postsQueryRepository.getPostById(
      creatingPost.data!.postId,
    );
    if (!post) throw new NotFoundException();
    return post;
  }
  @HttpCode(204)
  @Put(':id')
  async updatePost(@Param('id') postId, @Body() model: InputPostCreate) {
    const command = new UpdatePostCommand(
      postId,
      model.title,
      model.shortDescription,
      model.content,
      model.blogId,
    );
    const post = await this.commandBus.execute<
      UpdatePostCommand,
      InterlayerNotice<CommandUpdatePostOutputData>
    >(command);

    if (post.hasError()) throw new NotFoundException();
    return;
  }
  @HttpCode(204)
  @Delete(':id')
  async deletePost(@Param('id') postId: string) {
    const post = await this.postService.deletePost(postId);
    if (!post) throw new NotFoundException();
    return;
  }
}
