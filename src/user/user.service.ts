import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { type GoogleProfile } from "src/auth/google/google.profile";
import { Repository } from "typeorm";

import type { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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

  async findOne(account: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      select: ["id", "email", "name", "account", "password"],
      where: [{ email: account }, { account }],
    });
  }

  async createByGoogle(userDto: GoogleProfile): Promise<UserEntity> {
    const user = this.userRepository.create({
      account: userDto.externalId,
      email: userDto.email,
      name: userDto.displayName,
    });

    await user.save();

    return user;
  }
}
