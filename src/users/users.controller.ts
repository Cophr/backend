import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { SETTINGS } from "./users.utils";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UsePipes(SETTINGS.VALIDATION_PIPE)
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
