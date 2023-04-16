import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import * as morgan from "morgan";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan("default", { stream: logStream }));
  setupSwagger(app);
  await app.listen(3000);
}

const logStream = fs.createWriteStream("./log/access.log", {
  flags: "a", // append
});

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
