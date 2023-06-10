import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { validationPipe } from "./pipes/validation-pipe";

function setupSwagger(app: INestApplication) {
  const builder = new DocumentBuilder();
  const config = builder
    .setTitle(process.env.APP_SWAGGER_Title ?? "Cophr")
    .setDescription(process.env.APP_SWAGGER_Description ?? "")
    .setVersion(process.env.APP_SWAGGER_Version ?? "N/A")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(validationPipe);
  setupSwagger(app);
  await app.listen(3000);
}

void bootstrap();
