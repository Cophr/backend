import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { CreateUserBadrequestError } from "src/user/exceptions/create-user-badrequest-error.exception";
import { CreateUserConflictError } from "src/user/exceptions/create-user-conflict-error.exception";
import { CreateUserRespose } from "src/user/resposes/create-user-respose";

import { AuthService } from "./auth.service";

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
}
