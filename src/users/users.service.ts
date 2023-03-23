import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  async create(userDto: CreateUserDto): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDto.password, salt);
    const user = new UserEntity();
    user.name = userDto.name;
    user.account = userDto.account;
    user.email = userDto.email;
    user.password = hash;
    return await user.save();
  }
}