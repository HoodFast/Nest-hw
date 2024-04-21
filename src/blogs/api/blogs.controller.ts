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
import { BlogService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import {
  PostCreateData,
  PostInput,
} from '../../posts/api/input/PostsCreate.dto';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { Response } from 'express';

enum sortDirection {
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
    protected postRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
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
    const blog = await this.blogService.createBlog(inputModel);
    return blog;
  }
  @Post(':id/posts')
  async createPostForBlog(
    @Param('id') blogId: string,
    @Body() input: PostInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const postCreateData: PostCreateData = {
      title: input.title,
      content: input.content,
      shortDescription: input.shortDescription,
      blogId,
      createdAt: new Date().toISOString(),
    };

    const userId = '';
    const post = await this.postRepository.createPost(postCreateData, userId);
    debugger;
    if (!post) return res.sendStatus(404);
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
