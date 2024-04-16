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
  getPostById(@Param('id') postId: string) {
    const userId = '';
    return this.postService.getPostById(userId, postId);
  }
  @Get(':id/comments')
  async getCommentsForPost(
    @Param('id') postId: string,
    @Query() query: QueryPostInputModel,
  ) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? 'desc',
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };
    const userId = '';
    const comments = this.commentsQueryRepository.getAllByPostId(
      userId,
      postId,
      sortData,
    );
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
    await this.postService.createPost(newPost, userId);
    return {};
  }
  @Put(':id')
  async updatePost(
    @Param('id') postId,
    @Body() model: InputPostCreate,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.postService.updatePost(postId, model);
    return res.sendStatus(204);
  }
  @Delete(':id')
  async deletePost(@Param('id') postId: string) {
    await this.postService.deletePost(postId);
    return;
  }
}
