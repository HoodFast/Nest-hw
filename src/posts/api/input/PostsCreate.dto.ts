export class PostInput {
  title: string;
  shortDescription: string;
  content: string;
}

export class InputPostCreate extends PostInput {
  blogId: string;
}

export class PostCreateData extends InputPostCreate {
  createdAt: string;
}
