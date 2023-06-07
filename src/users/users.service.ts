import { HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  async create(userDto: CreateUserDto) {
    const hash = await bcrypt.hashSync(userDto.password, 5);
    const user = new UserEntity();
    user.name = userDto.name;
    user.account = userDto.account;
    user.email = userDto.email;
    user.password = hash;
    await user.save();
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }
}
