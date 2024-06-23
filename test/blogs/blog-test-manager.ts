import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createBlogInputDto } from '../../src/blogs/api/model/input/create-blog-input-dto';
import { PostInput } from '../../src/posts/api/input/PostsCreate.dto';

export class BlogTestManager {
  constructor(protected readonly app: INestApplication) {}

  async createBlog(createBlogData: createBlogInputDto, expectStatus: number) {
    const response = await request(this.app.getHttpServer())
      .post('/blogs')
      .auth('admin', 'qwerty')
      .send(createBlogData)
      .expect(expectStatus);
    return response;
  }
  async createPostForBlog(
    createPostData: PostInput,
    blogId: string,
    expectStatus: number,
  ) {
    const response = await request(this.app.getHttpServer())
      .post(`/blogs/${blogId}/posts`)
      .auth('admin', 'qwerty')
      .send(createPostData)
      .expect(expectStatus);
    return response;
  }
  checkValidateErrors(response: any) {
    const result = response.body;

    expect(result).toEqual({
      errorsMessages: [
        { message: expect.any(String), field: expect.any(String) },
        { message: expect.any(String), field: expect.any(String) },
        { message: expect.any(String), field: expect.any(String) },
      ],
    });
  }
}
