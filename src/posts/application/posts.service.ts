import { PostsRepository } from '../infrastructure/posts.repository';
import { Injectable } from '@nestjs/common';

import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { CreatePostInputType, PostTypeCreate } from '../api/PostCreate.dto';
import { SortData } from '../../base/sortData/sortData.model';

@Injectable()
export class PostService {
  constructor(
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async getAllPosts(userId: string, data: SortData) {
    return await this.postsQueryRepository.getAllPosts(data, userId);
  }

  async createPost(data: PostTypeCreate) {
    const blog = await this.blogsQueryRepository.getBlogById(data.blogId);
    const createdPost = await this.postsRepository.createPost(
      data,
      blog[0].name,
    );
    return createdPost;
  }
  async updatePost(
    postId: string,
    data: CreatePostInputType,
  ): Promise<boolean> {
    return await this.postsRepository.updatePost(postId, data);
  }

  async getPostById(userId: string, postId: string) {
    return this.postsQueryRepository.getPostById(userId, postId);
  }
  async deletePost(postId: string): Promise<boolean> {
    return await this.postsRepository.deletePost(postId);
  }
}
