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
  content: string;
};

@Controller('posts')
export class PostsController {
  constructor(protected postService: PostService) {}
  @Get()
  getPosts(@Query() query: { term: string }) {
    return [{ title: 'yoyo' }].filter(
      (i) => !query || i.title.indexOf(query.term) > -1,
    );
  }

  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postService.findPost(postId);
  }
  @Post()
  createPost(@Body() inputModel: CreatePostInputType) {
    return { id: 1, title: inputModel.title, content: inputModel.content };
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
