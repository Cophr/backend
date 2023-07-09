import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { CreateUserBadrequestError } from "src/user/exceptions/create-user-badrequest-error.exception";
import { CreateUserConflictError } from "src/user/exceptions/create-user-conflict-error.exception";
import { CreateUserRespose } from "src/user/resposes/create-user-respose";

import { AuthService } from "./auth.service";
import { UserLoginUnauthorizedError } from "./exception/user-login-unauthorized-error.exception";
import { type JwtUser } from "./jwt/jwt.interface";
import { LocalStrategy } from "./local/local.strategy";
import { LocalAuthGuard } from "./local/local-auth.guard";
import { GenerateTokenRespose } from "./respose/generate-token.respose";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    description: "會檢查是否重複過的資料",
    summary: "使用者註冊",
  })
  @ApiCreatedResponse({
    description: "使用者創建成功",
    type: CreateUserRespose,
  })
  @ApiConflictResponse({
    description: "使用者資料重覆",
    type: CreateUserConflictError,
  })
  @ApiBadRequestResponse({
    description: "使用者格式不符",
    type: CreateUserBadrequestError,
  })
  async register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    description:
      "email or account as login account.  \n" +
      "When the account information is correct will return token.",
    summary: "user local login",
  })
  @ApiCreatedResponse({
    description: "Generate token",
    type: GenerateTokenRespose,
  })
  @ApiUnauthorizedResponse({
    description: "Account information error",
    type: UserLoginUnauthorizedError,
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req: LocalStrategy) {
    return this.authService.login(req.user as JwtUser);
  }
}
