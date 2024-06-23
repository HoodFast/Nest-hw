import { Trim } from '../../../../base/validate/trim';
import { IsString, Matches, MaxLength } from 'class-validator';

export class createBlogInputDto {
  @Trim()
  @IsString()
  @MaxLength(15)
  name: string;
  @Trim()
  @IsString()
  @MaxLength(500)
  description: string;
  @Trim()
  @IsString()
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  @MaxLength(100)
  websiteUrl: string;
}
