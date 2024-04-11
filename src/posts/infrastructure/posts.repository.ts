import { Injectable } from '@nestjs/common';
import { PostTypeCreate } from '../api/posts.controller';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(data: PostTypeCreate, blogName: string) {
    const createdPost = new this.postModel({ ...data, blogName });
    return await createdPost.save();
  }
  findPostById(id: string) {
    return `post ${id}`;
  }
}
