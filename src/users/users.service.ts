import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { CreateUserDto, CreateUserParam } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  async register(userDto: CreateUserDto): Promise<object> {
    const existingUser = await UserEntity.findOne({
      where: [
        { email: userDto.email },
        { name: userDto.name },
        { account: userDto.account },
      ],
    });
    if (existingUser) {
      Object.keys(existingUser).forEach(key => {
        if (existingUser[key] === userDto[key]) {
          throw new ConflictException({
            message: key + " has been registered.",
          });
        }
      });
    }
    if (userDto.confirm !== userDto.password) {
      throw new ConflictException({
        message: "Confirm and password do not match, please try again.",
      });
    }
    return this.create(userDto);
  }
  async create(userDto: CreateUserParam): Promise<object> {
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
