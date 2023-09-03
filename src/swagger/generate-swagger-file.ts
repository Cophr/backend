import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { type SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import * as fs from "fs";

import { SwaggerGenerateModule } from "./swagger.module";

const securitySchemes: SecuritySchemeObject = {
  bearerFormat: "JWT",
  scheme: "bearer",
  type: "http",
};

async function generateSwaggerJson() {
  const app = await NestFactory.create(SwaggerGenerateModule);

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_SWAGGER_Title ?? "Cophr")
    .setDescription(process.env.APP_SWAGGER_Description ?? "")
    .setVersion(process.env.APP_SWAGGER_Version ?? "N/A")
    .addBearerAuth(securitySchemes)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync("swagger-docs.json", JSON.stringify(document));

  await app.close();
}

void generateSwaggerJson();
