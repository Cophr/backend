import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";

import { SwaggerGenerateModule } from "./swagger.module";

async function generateSwaggerJson() {
  const app = await NestFactory.create(SwaggerGenerateModule);

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_SWAGGER_Title ?? "Cophr")
    .setDescription(process.env.APP_SWAGGER_Description ?? "")
    .setVersion(process.env.APP_SWAGGER_Version ?? "N/A")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync("swagger-docs.json", JSON.stringify(document));

  await app.close();
}

void generateSwaggerJson();
