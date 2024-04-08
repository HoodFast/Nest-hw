import { PostDocument } from './post.schema';

export const postMapper = (post: PostDocument, userId?: string): PostType => {
  const getNewestLikes = post.getNewestLikes();
  const newestLikes = getNewestLikes.map(newestLikesMapper);
  let myStatus = likesStatuses.none;
  if (userId) {
    myStatus = post.getMyStatus(userId);
  }

  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus,
      newestLikes,
    },
  };
};
