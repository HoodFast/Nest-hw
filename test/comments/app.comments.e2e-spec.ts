import { AppModule } from '../../src/app.module';
import { BlogTestManager } from '../blogs/blog-test-manager';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { appSettings } from '../../src/settings/app.settings';
import { PostTestManager } from '../posts/post-test-manager';
import { blogsDto, postsDto, usersDto } from '../dtos/test.dto';
import { TestManager } from '../testManager';

import { CommentTestManager } from './comment-test-manager';

describe('CommentsController (e2e)', () => {
  let app: INestApplication;
  let httpServer;
  let blogTestManager;
  let postTestManager;
  let testManager;
  let commentTestManager;
  let createdBlogRes;
  let createdPostRes;
  let accessToken;
  let createComment;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
    blogTestManager = new BlogTestManager(app);
    postTestManager = new PostTestManager(app);
    commentTestManager = new CommentTestManager(app);
    testManager = new TestManager(app);
  });
  beforeEach(async () => {
    accessToken = await testManager.createAccessToken();
    createdBlogRes = await blogTestManager.createBlog(
      blogsDto.createBlogData,
      201,
    );
    createdPostRes = await postTestManager.createPost(
      {
        ...postsDto.createPostData,
        blogId: createdBlogRes.body.id,
      },
      201,
    );
    createComment = await commentTestManager.createComment(
      'comment content',
      createdPostRes.body.id,
      accessToken,
      201,
    );
  });

  afterEach(async () => {
    await testManager.deleteAll();
  });
  expect.setState({
    createPostData: postsDto.createPostData,
    updatePostData: postsDto.updatePostData,
    createWrongPostData: postsDto.createWrongPostData,
    createBlogData: blogsDto.createBlogData,
    createUserData: usersDto.createUserData,
  });

  it('create new comment for post and update like status', async () => {
    const createComment = await commentTestManager.createComment(
      'comment content',
      createdPostRes.body.id,
      accessToken,
      201,
    );
    await commentTestManager.addLikeForComment(
      createComment.body.id,
      accessToken,
    );
    const likesComment = await commentTestManager.getComment(
      createComment.body.id,
    );
    commentTestManager.checkCommentBody(likesComment);
  });

  it('comment don`t create, validation error status 400', async () => {
    const badResponse = await commentTestManager.createComment(
      1,
      createdPostRes.body.id,
      accessToken,
      201,
    );
    commentTestManager.checkValidateErrors(badResponse);
  });

  it('comment don`t create because unauthorised, status 401', async () => {
    const wrongAccess = '1234';
    await commentTestManager.createComment(
      'comment content',
      createdPostRes.body.id,
      wrongAccess,
      401,
    );
  });

  it('update comment ', async () => {
    await commentTestManager.updateComment(
      'new content',
      createComment.body.id,
      accessToken,
      204,
    );
    const updatedComment = commentTestManager.getComment(createComment.body.id);
    expect(updatedComment.body.content).toBe('new content');
  });
  it('delete comment ', async () => {
    await commentTestManager.deleteComment(
      `comment/${createComment.body.id}`,
      accessToken,
    );
    await commentTestManager.getComment(createComment.body.id, 404);
  });
  it('don`t delete comment because Unauthorized', async () => {
    const wrongToken = '';
    await commentTestManager.deleteComment(
      `comment/${createComment.body.id}`,
      wrongToken,
      401,
    );
  });
  it('get all comments by post', async () => {
    for (let i = 0; i < 4; i++) {
      await commentTestManager.createComment(
        'comment content',
        createdPostRes.body.id,
        accessToken,
        201,
      );
    }
    const res = await commentTestManager.getAllComments(createdPostRes.body.id);
    await commentTestManager.checkAllPostsBody(res);
  });
});
