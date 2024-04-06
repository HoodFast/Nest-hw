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

type CreatePostInputType = {
  title: string;
  content: string;
};

@Controller('users')
export class PostsController {
  @Get()
  getPosts(@Query() query: { term: string }) {
    return [{ title: 'yoyo' }].filter(
      (i) => !query || i.title.indexOf(query.term) > -1,
    );
  }

  @Post()
  createPost(@Body() inputModel: CreatePostInputType) {
    return { id: 1, title: inputModel.title, content: inputModel.content };
  }

  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return [{ id: 1 }, { id: 2 }].find((i) => i.id === +postId);
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
