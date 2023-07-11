import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { jwtAccessConfig } from "src/config/jwt.config";
import { UserEntity } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAccessStrategy } from "./jwt/jwt-access.strategy";
import { LocalStrategy } from "./local/local.strategy";

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync(jwtAccessConfig),
  ],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy],
})
export class AuthModule {}
