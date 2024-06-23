import { Trim } from '../../../base/validate/trim';
import { IsString, MaxLength } from 'class-validator';

export class PostInput {
  @Trim()
  @IsString()
  @MaxLength(30)
  title: string;
  @Trim()
  @IsString()
  @MaxLength(100)
  shortDescription: string;
  @Trim()
  @IsString()
  @MaxLength(1000)
  content: string;
}

export class InputPostCreate extends PostInput {
  @Trim()
  @IsString()
  blogId: string;
}

export class PostCreateData extends InputPostCreate {
  createdAt: string;
}
