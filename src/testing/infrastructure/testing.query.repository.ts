import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../blogs/domain/blog.schema';
import { Comment, CommentDocument } from '../../comments/domain/comment.schema';
import { Post, PostDocument } from '../../posts/domain/post.schema';
import { User, UserDocument } from '../../users/domain/user.schema';

@Injectable()
export class TestingQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async deleteAll(): Promise<boolean> {
    await this.userModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.postModel.deleteMany({});
    return true;
  }
}
