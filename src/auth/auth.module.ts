import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local/local.strategy";

@Module({
  controllers: [AuthController],
  imports: [UserModule, PassportModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
