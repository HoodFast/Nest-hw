import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersSqlQueryRepository } from './users/infrastructure/users.sql.query.repository';
import { UsersSqlRepository } from './users/infrastructure/users.sql.repository';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersService } from './users/application/users.service';
import { BlogsSqlRepository } from './blogs/infrastructure/blogs.sql.repository';
import { BlogsSqlQueryRepository } from './blogs/infrastructure/blogs.sql.query.repository';
import { BlogSortData, SortData } from './base/sortData/sortData.model';
import { createBlogInputDto } from './blogs/api/model/input/create-blog-input-dto';
import { randomUUID } from 'crypto';
import { PostsSqlQueryRepository } from './posts/infrastructure/posts.sql.query.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    protected userSqlQueryRepository: UsersSqlQueryRepository,
    protected userSqlRepository: UsersSqlRepository,
    protected userRepository: UsersRepository,
    protected blogSqlRepository: BlogsSqlRepository,
    protected blogSqlQueryRepository: BlogsSqlQueryRepository,
    protected postSqlQueryRepository: PostsSqlQueryRepository,
  ) {}
  @Get()
  async hello() {
    return 'Start App';
  }
  @Get('get')
  async getAllBlogs() {
    const sortData: BlogSortData = {
      sortBy: 'createdAt',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10,
      searchNameTerm: '',
    };
    const res = await this.blogSqlQueryRepository.getAllBlogs(sortData);

    return res;
  }
  @Get('getPosts')
  async getAllPosts() {
    const userId = '98cd1b37-cb25-424c-89be-90f73185b011';
    const sortData: BlogSortData = {
      sortBy: 'createdAt',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10,
      searchNameTerm: '',
    };
    const res = await this.postSqlQueryRepository.getAllPosts(sortData, userId);

    return res;
  }
  @Get('get/:id')
  async getForId(@Param('id') id: string) {
    const res = await this.blogSqlQueryRepository.getBlogById(id);
    return res;
  }

  @Post('create_blog')
  async createBlog() {
    const random = randomUUID();
    const data: createBlogInputDto = {
      name: random,
      description: 'testDescription',
      websiteUrl: 'www.leningrad.ru',
    };
    const res = await this.blogSqlRepository.createBlog(data);
    return res;
  }
  @Post('update_blog/:id')
  async updateBlog(@Param('id') id: string) {
    const updateDate: createBlogInputDto = {
      name: 'blog is updated',
      description: 'blog is updated',
      websiteUrl: 'www.blogisupdated.ru',
    };
    const res = await this.blogSqlRepository.updateBlog(id, updateDate);
    return res;
  }
  @Delete('delete_blog/:id')
  async deleteBlog(@Param('id') id: string) {
    const res = await this.blogSqlRepository.deleteBlog(id);
    return res;
  }
}
