import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Request } from "express";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { CreateUserBadrequestError } from "src/user/exceptions/create-user-badrequest-error.exception";
import { CreateUserConflictError } from "src/user/exceptions/create-user-conflict-error.exception";
import { CreateUserResponse } from "src/user/responses/create-user-response";

import { AuthService } from "./auth.service";
import { UserLoginUnauthorizedError } from "./exception/user-login-unauthorized-error.exception";
import { type JwtUser } from "./jwt/jwt.interface";
import { LocalAuthGuard } from "./local/local-auth.guard";
import { GenerateTokenResponse } from "./responses/generate-token.response";

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
    type: CreateUserResponse,
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
    description: "Will return token when the account information is correct.",
    summary: "login with our account",
  })
  @ApiCreatedResponse({
    description: "Success with generated token",
    type: GenerateTokenResponse,
  })
  @ApiUnauthorizedResponse({
    description: "Account information error",
    type: UserLoginUnauthorizedError,
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Req() request: Request) {
    return this.authService.login(request.user as JwtUser);
  }
}
