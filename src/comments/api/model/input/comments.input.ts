import { IsString } from 'class-validator';

export class CommentsInput {
  @IsString()
  content: string;
}
export class IdInput {
  @IsString()
  id: string;
}
