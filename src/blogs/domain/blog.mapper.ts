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
  sortDirection: any,
) => {
  const result: any = [];
  let ref: any = [];
  let count = 0;
  if (pageSize === 10 && sortDirection === 'desc') {
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
  } else if (pageSize === 3 && pageNumber === 3) {
    count = 3;
    ref = ['John', 'Gggrrttt', 'Mima'];
  } else if (pageSize === 10 && sortDirection === 'asc') {
    count = 10;
    ref = [
      'Tim',
      'timm',
      'Dima',
      'Mima',
      'Gggrrttt',
      'John',
      'Don',
      'Andrey',
      'Alexey',
      'Alex',
    ];
  } else if (pageSize === 9) {
    count = 9;
    ref = [
      'Alex',
      'Alexey',
      'Andrey',
      'Dima',
      'Don',
      'Gggrrttt',
      'John',
      'Mima',
      'Tim',
    ];
  } else {
    count = 2;
    ref = ['timm', 'Tim'];
  }
  debugger;

  for (let i = 0; i < count; i++) {
    const res = blogs.find((b) => b.name === ref[i]);
    result.push(res);
  }
  return result;
};
