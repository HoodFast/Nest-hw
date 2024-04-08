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
import { PostService } from './posts.service';

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

@Controller('posts')
export class PostsController {
  constructor(protected postService: PostService) {}
  @Get()
  async getAllPosts(@Query() query: { term: string }) {
    const posts = await this.postService.getAllPosts();
    return [{ title: 'yoyo' }].filter(
      (i) => !query || i.title.indexOf(query.term) > -1,
    );
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
