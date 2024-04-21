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

export const fakeMappers = (
  blogs: OutputBlogMapType[],
  pageSize: number,
  pageNumber: number,
) => {
  const result: any = [];
  let ref: any = [];
  let count = 0;
  if (pageSize === 10) {
    count = 10;
    ref = [
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
  } else if (pageSize === 3 && pageNumber === 1) {
    count = 3;
    ref = ['Timma', 'Tima', 'Alex'];
  } else {
    count = 3;
    ref = ['John', 'Gggrrttt', 'Mima'];
  }
  debugger;

  for (let i = 0; i < count; i++) {
    const res = blogs.find((b) => b.name === ref[i]);
    result.push(res);
  }
  return result;
};
