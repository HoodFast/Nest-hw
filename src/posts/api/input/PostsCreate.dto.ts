import { Trim } from '../../../base/validate/trim';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostInput {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string;
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  shortDescription: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}

export class InputPostCreate extends PostInput {
  @Trim()
  @IsString()
  @IsNotEmpty()
  blogId: string;
}

export class PostCreateData extends InputPostCreate {
  @Trim()
  @IsString()
  createdAt: string;
}
