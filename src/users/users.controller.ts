import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { CreateUserDto } from "./dto/create-user.dto";
import { CreateEntityUserError } from "./exceptions/create-error.exception";
import { UsersService } from "./users.service";
import { SETTINGS } from "./users.utils";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UsePipes(SETTINGS.VALIDATION_PIPE)
  @ApiCreatedResponse({
    description: "使用者創建成功",
  })
  @ApiUnprocessableEntityResponse({
    description: "使用者格式不符",
    type: CreateEntityUserError,
  })
  create(@Body() userDto: CreateUserDto) {
    const user = this.usersService.create(userDto);
    if (!user) {
      throw new BadRequestException("Have some error");
    }
    return {
      message: "created OK",
    };
  }
}
