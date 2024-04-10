import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from '../application/posts.service';

type CreatePostInputType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export type PostTypeCreate = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: string;
};

export type Pagination<I> = {
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
  items: I[];
};
export type QueryPostInputModel = {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};

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
    const posts = await this.postService.getAllPosts(sortData, userId);

    return posts;
  }

  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postService.findPostById(postId);
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
  @Delete(':id')
  deletePost(@Param('id') postId: string) {
    return postId;
  }

  @Put(':id')
  updatePost(@Param('id') postId, @Body() model: CreatePostInputType) {
    return { postId, model };
  }
}
