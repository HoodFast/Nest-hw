import { ApiSettings } from './apiSettings/api-settings';
import { DataBaseSettings } from './dataBaseSettings/data-base-settings';
import { EnvironmentSettings } from './environmentSettings/environment-settings';

export type EnvironmentVariable = { [key: string]: string };

export type ConfigurationType = ReturnType<typeof Configuration.createConfig>;

export class Configuration {
  apiSettings: ApiSettings;
  databaseSettings: DataBaseSettings;
  environmentSettings: EnvironmentSettings;
  private constructor(configuration: Configuration) {
    Object.assign(this, configuration);
  }
  static createConfig(environmentVariables: Record<string, string>) {
    return new this({
      apiSettings: new ApiSettings(environmentVariables),
      databaseSettings: new DataBaseSettings(environmentVariables),
      environmentSettings: new EnvironmentSettings(environmentVariables),
    });
  }
}

export default () => {
  const environmentVariables = process.env as EnvironmentVariable;
  return Configuration.createConfig(environmentVariables);
};
