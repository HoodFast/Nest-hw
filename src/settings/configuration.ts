import { ApiSettings } from './apiSettings/api-settings';
import { DataBaseSettings } from './dataBaseSettings/data-base-settings';
import { EnvironmentSettings } from './environmentSettings/environment-settings';
import { ConfigService } from '@nestjs/config';
import { JwtSettings } from './jwtSettings/jwtSettings';

export type EnvironmentVariable = { [key: string]: string };

export type ConfigurationType = ReturnType<typeof Configuration.createConfig>;
export type ConfigServiceType = ConfigService<ConfigurationType>;

export class Configuration {
  apiSettings: ApiSettings;
  databaseSettings: DataBaseSettings;
  environmentSettings: EnvironmentSettings;
  jwtSettings: JwtSettings;
  private constructor(configuration: Configuration) {
    Object.assign(this, configuration);
  }
  static createConfig(
    environmentVariables: Record<string, string>,
  ): Configuration {
    return new this({
      apiSettings: new ApiSettings(environmentVariables),
      databaseSettings: new DataBaseSettings(environmentVariables),
      environmentSettings: new EnvironmentSettings(environmentVariables),
      jwtSettings: new JwtSettings(environmentVariables),
    });
  }
}

export default () => {
  const environmentVariables = process.env as EnvironmentVariable;
  return Configuration.createConfig(environmentVariables);
};
