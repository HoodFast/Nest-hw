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

export const fakeMappers = (blogs: OutputBlogMapType[], pageNumber: number) => {
  const result: any = [];
  let ref: any = [];
  let count = 0;
  if (pageNumber === 1) {
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
  } else {
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
  }
  debugger;

  for (let i = 0; i < count; i++) {
    const res = blogs.find((b) => b.name === ref[i]);
    result.push(res);
  }
  return result;
};
