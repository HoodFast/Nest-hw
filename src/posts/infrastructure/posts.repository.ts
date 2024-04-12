import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.schema';
import { Model } from 'mongoose';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';
import { ObjectId } from 'mongodb';
import { CreatePostInputType, PostTypeCreate } from '../api/PostCreate.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  async createPost(data: PostTypeCreate, blogName: string) {
    const createdPost = new this.postModel({ ...data, blogName });
    return await createdPost.save();
  }
  async updatePost(postId: string, data: CreatePostInputType) {
    try {
      const blog = await this.blogQueryRepository.getBlogById(data.blogId);
      console.log(blog);
      if (!blog[0]) {
        return false;
      }
      const res = await this.postModel.updateOne(
        { _id: new ObjectId(postId) },
        {
          $set: {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: blog[0].name,
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
