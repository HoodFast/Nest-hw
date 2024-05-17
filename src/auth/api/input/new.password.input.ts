import { IsString, Length } from 'class-validator';

export class recoveryPassInputDto {
  @IsString()
  @Length(6, 20)
  newPassword: string;
  @IsString()
  recoveryCode: string;
}
