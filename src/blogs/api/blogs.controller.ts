import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BlogService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { PostInput } from '../../posts/api/input/PostsCreate.dto';

import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import {
  CommandCreateBlogData,
  CreateBlogCommand,
} from './use-cases/create-blog.usecase';
import { InterlayerNotice } from '../../base/models/Interlayer';
import {
  CommandCreatePostForBlogOutput,
  CreatePostForBlogCommand,
} from './use-cases/create-post-for-blog.usecase';

export enum sortDirection {
  asc = 'asc',
  desc = 'desc',
}

export type createBlogInputType = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type queryBlogsInputType = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: sortDirection;
  pageNumber?: number;
  pageSize?: number;
};

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogService: BlogService,
    protected blogsQueryRepository: BlogsQueryRepository,
    // protected postRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: queryBlogsInputType) {
    const sortData = {
      searchNameTerm: query.searchNameTerm ?? null,
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? sortDirection.desc,
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };
    const blogs = await this.blogsQueryRepository.getAllBlogs(sortData);
    return blogs;
  }

  @Get(':id')
  async getBlogById(
    @Param('id') blogId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) return res.sendStatus(404);
    return blog;
  }

  @Get(':id/posts')
  async getPostsForBlog(
    @Param('id') blogId: string,
    @Query() query: queryBlogsInputType,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? sortDirection.desc,
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };
    const userId = '';
    const posts = await this.postsQueryRepository.getAllPostsForBlog(
      userId,
      blogId,
      sortData,
    );
    if (!posts) return res.sendStatus(404);
    return posts;
  }

  @Post()
  async createBlog(@Body() inputModel: createBlogInputType) {
    const command = new CreateBlogCommand(
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
    );
    const creatingBlog = await this.commandBus.execute<
      CreateBlogCommand,
      InterlayerNotice<CommandCreateBlogData>
    >(command);
    const blog = await this.blogsQueryRepository.getBlogById(
      creatingBlog.data!.blogId,
    );
    return blog;
  }
  @Post(':id/posts')
  async createPostForBlog(
    @Param('id') blogId: string,
    @Body() input: PostInput,
  ) {
    const command = new CreatePostForBlogCommand(
      input.title,
      input.content,
      input.shortDescription,
      blogId,
    );

    const creatingPost = await this.commandBus.execute<
      CreatePostForBlogCommand,
      InterlayerNotice<CommandCreatePostForBlogOutput>
    >(command);

    if (creatingPost.hasError())
      throw new NotFoundException(creatingPost.extensions[0].message);
    const post = await this.postsQueryRepository.getPostById(
      creatingPost.data!.postId,
    );
    return post;
  }

  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() body: createBlogInputType,
    @Res({ passthrough: true }) res: Response,
  ) {
    const updateBlogData: createBlogInputType = {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    };
    const updatedBlog = await this.blogService.updateBlog(
      blogId,
      updateBlogData,
    );
    if (!updatedBlog) return res.sendStatus(404);
    return res.sendStatus(204);
  }
  @Delete(':id')
  async deleteBlogById(
    @Param('id') blogId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deletedBlog = await this.blogService.deleteBlog(blogId);
    if (!deletedBlog) return res.sendStatus(404);
    return res.sendStatus(204);
  }
}
