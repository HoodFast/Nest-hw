import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blog.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { blogMapper } from '../domain/blog.mapper';
import { createBlogInputDto } from '../api/model/input/create-blog-input-dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(data: createBlogInputDto) {
    const create = new this.blogModel(data);
    await create.save();
    return blogMapper(create);
  }
  async updateBlog(blogId: ObjectId, updateDate: createBlogInputDto) {
    const updatedBlog = await this.blogModel.updateOne(
      { _id: blogId },
      {
        $set: {
          name: updateDate.name,
          description: updateDate.description,
          websiteUrl: updateDate.websiteUrl,
        },
      },
    );

    return !!updatedBlog.matchedCount;
  }
  async deleteBlog(id: ObjectId) {
    const deleted = await this.blogModel.deleteOne({ _id: id });
    return !!deleted.deletedCount;
  }
}
