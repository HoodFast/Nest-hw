import { EnvironmentVariable } from '../configuration';

export class JwtSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  AC_SECRET = this.environmentVariables.AC_SECRET;
  AC_TIME = this.environmentVariables.AC_TIME;
  RT_SECRET = this.environmentVariables.RT_SECRET;
  RT_TIME = this.environmentVariables.RT_TIME;
  RECOVERY_SECRET = this.environmentVariables.RECOVERY_SECRET;
  RECOVERY_TIME = this.environmentVariables.RECOVERY_TIME;
}
