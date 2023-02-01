import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";

import { AppModule } from "./app.module";
import { Environment } from "./config/env.validation";

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV !== Environment.Production) {
    setupSwagger(app);
  }
  await app.listen(3000);
}

function setupSwagger(app: INestApplication) {
  const builder = new DocumentBuilder();
  const config = builder
    .setTitle(process.env.APP_SWAGGER_Title)
    .setDescription(process.env.APP_SWAGGER_Description)
    .setVersion(process.env.APP_SWAGGER_Version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}

bootstrap();
