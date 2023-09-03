import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { AuthModule } from "src/auth/auth.module";
import { JwtAccessStrategy } from "src/auth/jwt/jwt-access.strategy";
import { dataSourceJest } from "src/config/data-source";
import jestConfig from "src/config/jest.config";
import { UserModule } from "src/user/user.module";

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot(dataSourceJest),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jestConfig],
    }),
    UserModule,
    AuthModule,
    JwtModule.register({}),
  ],
  providers: [AppService, JwtAccessStrategy],
})
export class SwaggerGenerateModule {}
