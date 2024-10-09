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
import {
  InputPostCreate,
  PostCreateData,
} from './posts/api/input/PostsCreate.dto';
import { PostsSqlRepository } from './posts/infrastructure/posts.sql.repository';
import { likesStatuses } from './posts/domain/post.schema';

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
    protected postSqlRepository: PostsSqlRepository,
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
  @Get('getpost')
  async getPost() {
    const sortData: BlogSortData = {
      sortBy: 'createdAt',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10,
      searchNameTerm: '',
    };
    const userId = '98cd1b37-cb25-424c-89be-90f73185b011';
    const blogId = '624e210e-5d0a-4fbe-87f2-4990544ec128';
    const res = await this.postSqlQueryRepository.getAllPostsForBlog(
      userId,
      blogId,
      sortData,
    );

    return res;
  }
  @Get('get/:id')
  async getForId(@Param('id') id: string) {
    const res = await this.blogSqlQueryRepository.getBlogById(id);
    return res;
  }

  @Post('create_post')
  async createPost() {
    const random = randomUUID();
    const data: PostCreateData = {
      createdAt: new Date(),
      blogId: '624e210e-5d0a-4fbe-87f2-4990544ec128',
      content: `test post content ${random}`,
      title: 'test post title',
      shortDescription: 'test short description',
    };
    const res = await this.postSqlRepository.createPost(
      data,
      '98cd1b37-cb25-424c-89be-90f73185b011',
    );
    return res;
  }
  @Post('update_post')
  async updatePost() {
    const random = randomUUID();
    const data: InputPostCreate = {
      blogId: '624e210e-5d0a-4fbe-87f2-4990544ec128',
      content: `new test post content ${random}`,
      title: 'new test post title',
      shortDescription: 'new test short description',
    };
    const res = await this.postSqlRepository.updatePost(
      '0da7e025-a5b5-429e-937b-3139af8f7b76',
      data,
    );
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
  @Post('createLike')
  async createLike() {
    const userId = '4707b8bd-b083-4f84-9f90-bda7b33fc976';
    const likeStatus = likesStatuses.like;
    const login = 'user 088';
    const postId = '08727b44-c144-4e63-b4f8-5c2ba609b104';
    await this.postSqlRepository.updateLikeToPost(
      userId,
      likeStatus,
      login,
      postId,
    );
  }
}
