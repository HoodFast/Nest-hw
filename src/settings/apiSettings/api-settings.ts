import { EnvironmentVariable } from '../configuration';

export class ApiSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  PORT: number = Number(this.environmentVariables.PORT);
  LOCAL_HOST: string | undefined = this.environmentVariables.LOCAL_HOST;
}
