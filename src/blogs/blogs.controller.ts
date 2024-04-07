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
import { BlogService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query.repository';

enum sortDirection {
  asc = 'asc',
  desc = 'desc',
}

export type createBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
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
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: queryBlogsInputType) {
    const sortData: queryBlogsInputType = {
      searchNameTerm: query.searchNameTerm ?? undefined,
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? sortDirection.desc,
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };
    const blogs = await this.blogQueryRepository.getAllBlogs(sortData);
    return blogs;
  }

  @Get(':id')
  async getBlogById(@Param('id') blogId: string) {
    const blog = await this.blogService.findBlog(blogId);
    return blog;
  }

  @Post()
  async createBlog(@Body() inputModel: createBlogInputType) {
    const blog = await this.blogService.createBlog(inputModel);
    return blog;
  }

  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() body: createBlogInputType,
  ) {
    const updateBlogModel: createBlogInputType = {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    };
    const updatedBlog = await this.blogService.updateBlog(
      blogId,
      updateBlogModel,
    );
    return updatedBlog;
  }
  @Delete(':id')
  async deleteBlogById(@Param('id') blogId: string) {
    const deletedBlog = await this.blogService.deleteBlog(blogId);
    return deletedBlog;
  }
}
