import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Request } from "express";
import { BadRequestError } from "src/error/bad-request-error";
import { ConflictError } from "src/error/conflict-error";
import { ForbiddenError } from "src/error/forbidden-error";
import { UnauthorizedError } from "src/error/unauthorized-error";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { CreateUserResponse } from "src/user/responses/create-user-response";

import { AuthService } from "./auth.service";
import { type JwtUser } from "./jwt/jwt.interface";
import { JwtRefreshGuard } from "./jwt/jwt-refresh.guard";
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
    type: ConflictError,
  })
  @ApiBadRequestResponse({
    description: "使用者格式不符",
    type: BadRequestError,
  })
  async register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    description:
      "Will return access and refresh token when the account information is correct.",
    summary: "login with our account",
  })
  @ApiCreatedResponse({
    description: "Success with generated token",
    type: GenerateTokenResponse,
  })
  @ApiForbiddenResponse({
    description: "Account information error",
    type: ForbiddenError,
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Req() request: Request) {
    return this.authService.sign(request.user as JwtUser);
  }

  @Get("refresh")
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    description:
      "Will return access and refresh token when the refresh token carried in the request is valid.",
    summary: "refresh token",
  })
  @ApiCreatedResponse({
    description: "Success with generated token",
    type: GenerateTokenResponse,
  })
  @ApiUnauthorizedResponse({
    description: String(
      "Token error  \n " +
        "When the token is not carried in the request.  \n" +
        "When the token has expired or become invalid.",
    ),
    type: UnauthorizedError,
  })
  async refresh(@Req() request: Request) {
    return this.login(request);
  }
}
