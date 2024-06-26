import { blogsDto, postsDto } from '../dtos/test.dto';
import { TestManager } from '../testManager';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/app.settings';
import { BlogTestManager } from './blog-test-manager';
import request from 'supertest';

describe('BlogsController (e2e)', () => {
  let app: INestApplication;
  let httpServer;
  let blogTestManager;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
    blogTestManager = new BlogTestManager(app);
  });
  afterAll(async () => {
    const testManager = new TestManager(app);
    await testManager.deleteAll();
  });
  expect.setState({
    createBlogData: blogsDto.createBlogData,
    createWrongBlogData: blogsDto.createWrongBlogData,
    createPostData: postsDto.createPostData,
    createWrongPostData: postsDto.createWrongPostData,
  });
  it('create blog this correct data', async () => {
    const { createBlogData } = expect.getState();
    const response = await blogTestManager.createBlog(createBlogData, 201);
    debugger;
    expect(response.body).toEqual({
      id: expect.any(String),
      name: createBlogData.name,
      description: createBlogData.description,
      websiteUrl: createBlogData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });
  it('blog don`t create, validation error status 400', async () => {
    const { createWrongBlogData } = expect.getState();
    const badResponse = await blogTestManager.createBlog(
      createWrongBlogData,
      400,
    );
    debugger;
    blogTestManager.checkValidateErrors(badResponse);
  });

  it('blog don`t create because unauthorised, status 401', async () => {
    const { createBlogData } = expect.getState();
    const response = await request(httpServer)
      .post('/blogs')
      .send(createBlogData)
      .expect(401);
    return response;
  });
  it('create post for blog this correct data', async () => {
    const { createBlogData, createPostData } = expect.getState();
    const createdBlogRes = await blogTestManager.createBlog(
      createBlogData,
      201,
    );

    const response = await blogTestManager.createPostForBlog(
      createPostData,
      createdBlogRes.body.id,
      201,
    );
    return response;
  });
  it('don`t create post for blog this incorrect data', async () => {
    const { createBlogData, createWrongPostData } = expect.getState();
    const createdBlogRes = await blogTestManager.createBlog(
      createBlogData,
      201,
    );

    const badResponse = await blogTestManager.createPostForBlog(
      createWrongPostData,
      createdBlogRes.body.id,
      400,
    );
    blogTestManager.checkValidateErrors(badResponse);
  });
  it('don`t create post for blog because unauthorised', async () => {
    const { createBlogData, createPostData } = expect.getState();
    const createdBlogRes = await blogTestManager.createBlog(
      createBlogData,
      201,
    );

    await request(httpServer)
      .post(`/blogs/${createdBlogRes.body.id}/posts`)
      .send(createPostData)
      .expect(401);
  });
  it('update blog ', async () => {
    const { createBlogData } = expect.getState();
    const createBlog = await blogTestManager.createBlog(createBlogData, 201);
    const updateBlogData = {
      name: 'new name',
      description: 'new description',
      websiteUrl: 'https://new-website.url',
    };

    await blogTestManager.updateBlog(updateBlogData, createBlog.body.id, 204);

    const updatedBlog = await request(httpServer).get(
      `/blogs/${createBlog.body.id}`,
    );
    expect(updatedBlog.body.name).toBe(updateBlogData.name);
  });
  it('delete blog ', async () => {
    const { createBlogData } = expect.getState();
    const createBlog = await blogTestManager.createBlog(createBlogData, 201);

    await blogTestManager.deleteBlog(`/blogs/${createBlog.body.id}`);
    const deletedBlog = await request(httpServer).get(
      `/blogs/${createBlog.body.id}`,
    );
    expect(deletedBlog.statusCode).toBe(404);
  });
  it('don`t delete blog because Unauthorized', async () => {
    const { createBlogData } = expect.getState();
    const createBlog = await blogTestManager.createBlog(createBlogData, 201);

    await request(httpServer)
      .delete(`/blogs/${createBlog.body.id}`)
      .expect(401);
  });
  it('get blog by id', async () => {
    const { createBlogData } = expect.getState();
    const createBlog = await blogTestManager.createBlog(createBlogData, 201);

    const res = await request(httpServer)
      .get(`/blogs/${createBlog.body.id}`)
      .expect(200);
    await blogTestManager.checkBlogBody(res);
  });
  it('get all blogs by id', async () => {
    const { createBlogData } = expect.getState();
    for (let i = 0; i < 4; i++) {
      await blogTestManager.createBlog(createBlogData, 201);
    }
    const res = await request(httpServer).get(`/blogs`).expect(200);
    await blogTestManager.checkAllBlogsBody(res);
  });
});
