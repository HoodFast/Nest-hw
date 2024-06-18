import { EnvironmentVariable } from '../configuration';

export class DataBaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  MONGO_CONNECTION_URI: string = this.environmentVariables.MONGO_URL;
  MONGO_CONNECTION_URI_FOR_TESTS: string =
    this.environmentVariables.MONGO_URL_TEST;
}
