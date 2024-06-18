import { EnvironmentVariable } from '../configuration';
import { IsString } from 'class-validator';

export class JwtSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsString()
  AC_SECRET = this.environmentVariables.AC_SECRET;
  @IsString()
  AC_TIME = this.environmentVariables.AC_TIME;
  @IsString()
  RT_SECRET = this.environmentVariables.RT_SECRET;
  @IsString()
  RT_TIME = this.environmentVariables.RT_TIME;
  @IsString()
  RECOVERY_SECRET = this.environmentVariables.RECOVERY_SECRET;
  @IsString()
  RECOVERY_TIME = this.environmentVariables.RECOVERY_TIME;
}
