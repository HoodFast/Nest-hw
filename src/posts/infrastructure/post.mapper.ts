import { Likes, likesStatuses, PostDocument } from '../domain/post.schema';

export class PostType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: likesStatuses;
    newestLikes: NewestLikes[];
  };
}
export class NewestLikes {
  addedAt: string;
  userId: string;
  login: string;
}
export const newestLikesMapper = (like: Likes): NewestLikes => {
  return {
    addedAt: like.updatedAt.toString(),
    userId: like.userId,
    login: like.login,
  };
};

export const postMapper = (post: PostDocument, userId: string): PostType => {
  const getNewestLikes = post.getNewestLikes();
  const newestLikes = getNewestLikes.map(newestLikesMapper);
  let myStatus = post.getMyStatus(userId);
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
