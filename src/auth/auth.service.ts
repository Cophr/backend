import { ConflictException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import type { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

import { type JwtUser } from "./jwt/jwt.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(userDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userDto.email }, { account: userDto.account }],
    });

    if (existingUser) {
      const keys = ["email", "account"];
      const conflictedAttributes: string[] = [];

      keys.forEach(key => {
        if (existingUser[key] === userDto[key]) {
          conflictedAttributes.push(`${key} 已被註冊。`);
        }
      });

      throw new ConflictException(conflictedAttributes);
    }

    return this.userService.create(userDto);
  }

  async login(user: JwtUser) {
    const token = this.jwtService.sign(user);

    return {
      accessToken: token,
      statusCode: HttpStatus.CREATED,
    };
  }

  async validateUser(username: string, password: string) {
    const user: UserEntity | null = await this.userService.findOne(username);

    if (!user) return null;

    const passwordCorrect = bcrypt.compareSync(password, user.password);
    const userData = { email: user.email, id: user.id };

    if (passwordCorrect) {
      return userData;
    }

    return null;
  }
}
