import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import appConfig from "./config/app.config";
import { dataSourceOptions } from "./config/data-source";
import { validate } from "./config/env.validation";
import { UserModule } from "./user/user.module";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validate,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
