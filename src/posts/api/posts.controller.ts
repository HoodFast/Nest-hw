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
import { CreatePostInputType, PostTypeCreate } from './PostCreate.dto';
import { QueryPostInputModel } from './postGetInput';

@Controller('posts')
export class PostsController {
  constructor(protected postService: PostService) {}
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
  @Post()
  async createPost(@Body() body: CreatePostInputType) {
    const newPost: PostTypeCreate = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      createdAt: new Date().toISOString(),
    };
    await this.postService.createPost(newPost);
    return {};
  }
  @Put(':id')
  async updatePost(
    @Param('id') postId,
    @Body() model: CreatePostInputType,
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
