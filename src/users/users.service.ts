import { Injectable } from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  async create(userDto: CreateUserDto) {
    const user = new UserEntity();
    user.name = userDto.name;
    user.account = userDto.account;
    user.email = userDto.email;
    user.password = userDto.password;
    await user.save();
    return {
      message: "創建成功",
    };
  }
}
