import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { PostService } from '../application/posts.service';
import { Response } from 'express';
import { InputPostCreate, PostCreateData } from './input/PostsCreate.dto';
import { QueryPostInputModel } from './input/PostsGetInput';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get()
  async getAllPosts(@Query() query: QueryPostInputModel) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? 'desc',
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };
    const userId = '';
    const posts = await this.postService.getAllPosts(userId, sortData);

    return posts;
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string, @Res() res: Response) {
    const userId = '';
    const post = await this.postService.getPostById(userId, postId);

    if (!post) return res.sendStatus(404);
    return post;
  }
  @Get(':id/comments')
  async getCommentsForPost(
    @Param('id') postId: string,
    @Query() query: QueryPostInputModel,
    @Res() res: Response,
  ) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? 'desc',
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
  async createPost(@Body() body: InputPostCreate) {
    const newPost: PostCreateData = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      createdAt: new Date().toISOString(),
    };
    const userId = '';
    const post = await this.postService.createPost(newPost, userId);
    return post;
  }
  @Put(':id')
  async updatePost(
    @Param('id') postId,
    @Body() model: InputPostCreate,
    @Res({ passthrough: true }) res: Response,
  ) {
    const post = await this.postService.updatePost(postId, model);
    if (!post) return res.sendStatus(404);
    return res.sendStatus(204);
  }
  @Delete(':id')
  async deletePost(@Param('id') postId: string, @Res() res: Response) {
    const post = await this.postService.deletePost(postId);
    if (!post) return res.sendStatus(404);
    return res.sendStatus(204);
  }
}
