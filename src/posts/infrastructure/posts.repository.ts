import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.schema';
import { Model } from 'mongoose';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { ObjectId } from 'mongodb';
import { InputPostCreate, PostCreateData } from '../api/input/PostsCreate.dto';
import { PostsQueryRepository } from './posts.query.repository';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async createPost(data: PostCreateData, userId: string) {
    const blog = await this.blogsQueryRepository.getBlogById(data.blogId);
    if (!blog) return null;
    const createdPost = new this.postModel({ ...data, blogName: blog.name });
    await createdPost.save();

    return await this.postsQueryRepository.getPostById(createdPost.id, userId);
  }
  async updatePost(postId: string, data: InputPostCreate) {
    try {
      const blog = await this.blogsQueryRepository.getBlogById(data.blogId);
      debugger;
      if (!blog) return false;

      const res = await this.postModel.updateOne(
        { _id: new ObjectId(postId) },
        {
          $set: {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: blog.name,
          },
        },
      );

      return !!res.matchedCount;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async deletePost(postId: string): Promise<boolean> {
    const res = await this.postModel.deleteOne({ _id: new ObjectId(postId) });

    return !!res.deletedCount;
  }
}
