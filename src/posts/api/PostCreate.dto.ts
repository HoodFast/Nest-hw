export class CreatePostInputType {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class PostTypeCreate extends CreatePostInputType {
  createdAt: string;
}
