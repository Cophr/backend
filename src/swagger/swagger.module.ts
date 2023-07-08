import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { AuthModule } from "src/auth/auth.module";
import { dataSourceJest } from "src/config/data-source";
import { UserModule } from "src/user/user.module";

@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot(dataSourceJest), UserModule, AuthModule],
  providers: [AppService],
})
export class SwaggerGenerateModule {}
