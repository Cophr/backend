import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { AuthModule } from "src/auth/auth.module";
import { JwtStrategy } from "src/auth/jwt/jwt.strategy";
import { dataSourceJest } from "src/config/data-source";
import jestConfig from "src/config/jest.config";
import { jwtConfigJest } from "src/config/jwt.config";
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
    JwtModule.registerAsync(jwtConfigJest),
  ],
  providers: [AppService, JwtStrategy],
})
export class SwaggerGenerateModule {}
