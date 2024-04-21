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

const id = [
  { id: '662534a551492afbacd1a8c6' },
  { id: '662534a551492afbacd1a8c4' },
  { id: '662534a551492afbacd1a8c2' },
  { id: '662534a551492afbacd1a8c0' },
  { id: '662534a451492afbacd1a8be' },
  { id: '662534a451492afbacd1a8b8' },
  { id: '662534a451492afbacd1a8b6' },
  { id: '662534a451492afbacd1a8b4' },
];
