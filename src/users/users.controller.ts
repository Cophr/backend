import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { CreateUserDto } from "./dto/create-user.dto";
import { CreateConflictUserError } from "./exceptions/create-conflict-error.exception";
import { CreateEntityUserError } from "./exceptions/create-entity-error.exception";
import { UsersService } from "./users.service";
import { SETTINGS } from "./users.utils";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UsePipes(SETTINGS.VALIDATION_PIPE)
  @ApiCreatedResponse({
    description: "Created Successfully",
  })
  @ApiConflictResponse({
    description: "Data Conflict",
    type: CreateConflictUserError,
  })
  @ApiUnprocessableEntityResponse({
    description: "Data Duplication",
    type: CreateEntityUserError,
  })
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.register(userDto);
  }
}
