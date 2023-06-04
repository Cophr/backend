import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { CreateUserBadrequestError } from "src/users/exceptions/create-user-badrequest-error.exception";
import { CreateUserConflictError } from "src/users/exceptions/create-user-conflict-error.exception";
import { CreateUserRespose } from "src/users/resposes/create-user-respose";

import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register")
  @ApiOperation({
    summary: "使用者註冊",
    description: "會檢查是否重複過的資料",
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
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }
}
