import { HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import type { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
  async create(userDto: CreateUserDto) {
    const hash = bcrypt.hashSync(userDto.password, 5);
    const user = new UserEntity();

    user.name = userDto.name;
    user.account = userDto.account;
    user.email = userDto.email;
    user.password = hash;
    await user.save();

    return {
      message: "創建成功",
      statusCode: HttpStatus.CREATED,
    };
  }
}
