import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createBlogInputDto } from '../../src/blogs/api/model/input/create-blog-input-dto';
import { PostInput } from '../../src/posts/api/input/PostsCreate.dto';

export class CommentTestManager {
  constructor(protected readonly app: INestApplication) {}

  async createComment(
    content: string,
    postId: string,
    accessToken: string,
    expectStatus: number,
  ) {
    const response = await request(this.app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content });

    return response;
  }
  async updateComment(
    newContent: string,
    commentId: string,
    accessToken: string,
    expectStatus: number,
  ) {
    const response = await request(this.app.getHttpServer())
      .put(`/comments/${commentId}`)
      .set('Authorized', `Bearer ${accessToken}`)
      .send({ content: newContent })
      .expect(expectStatus);
    return response;
  }
  async deleteComment(
    uri: string,
    accessToken: string,
    expectStatus: number = 204,
  ) {
    await request(this.app.getHttpServer())
      .delete(uri)
      .set('Authorized', `Bearer ${accessToken}`)
      .expect(expectStatus);
    return;
  }
  async getComment(commentId: string, expectedStatus: number = 200) {
    const httpServer = this.app.getHttpServer();
    const comment = await request(httpServer)
      .get(`/comments/${commentId}`)
      .expect(expectedStatus);
    return comment;
  }
  async addLikeForComment(commentId: string, accessToken: string) {
    const httpServer = this.app.getHttpServer();
    await request(httpServer)
      .put(`/comments/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        likeStatus: 'Like',
      })
      .expect(204);
  }
  checkCommentBody(response: any) {
    const comment = response.body;
    expect(comment).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String),
      },
      createdAt: expect.any(String),
      likesInfo: {
        likesCount: expect.any(Number),
        dislikesCount: expect.any(Number),
        myStatus: expect.any(String),
      },
    });
  }
  async getAllCommentsForPost(postId: string) {
    const res = await request(this.app.getHttpServer())
      .get(`posts/${postId}/comments`)
      .expect(200);
    return res;
  }
  checkAllPostsBody(response: any) {
    const comments = response.body;
    expect(comments).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 4,
      items: expect.any(Array),
    });
  }
  checkValidateErrors(response: any) {
    const result = response.body;
    expect(result).toEqual({
      errorsMessages: [
        { message: expect.any(String), field: expect.any(String) },
      ],
    });
  }
}
