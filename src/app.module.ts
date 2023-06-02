import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { dataSourceOptions } from "./config/data-source";
import { validate } from "./config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
