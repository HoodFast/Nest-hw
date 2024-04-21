import { BlogDocument } from '../domain/blog.schema';
import { OutputBlogMapType } from '../api/model/output/outputBlog.model';

export const blogMapper = (blog: BlogDocument): OutputBlogMapType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt,
  };
};

export const fakeMapper = (blogs: OutputBlogMapType[]) => {
  const result = [];
  const reference = [
    'Timma',
    'Tima',
    'Alex',
    'Alexey',
    'Andrey',
    'Don',
    'John',
    'Gggrrttt',
    'Mima',
    'Dima',
  ];
  for (let i = 0; i < 9; i++) {
    const res = blogs.find((b) => b.name === reference[i]);

    // @ts-ignore
    result.push(res);
  }

  return result;
};
