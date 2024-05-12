import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './settings/app.settings';
import { appConfig } from './base/config/appConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app);
  await app.listen(appConfig.PORT);
}
bootstrap();
