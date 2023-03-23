import { BadRequestException, Body, Controller, Post } from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
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
