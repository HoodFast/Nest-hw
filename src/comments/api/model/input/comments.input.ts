import { IsString } from 'class-validator';

export class CommentsInput {
  @IsString()
  content: string;
}
