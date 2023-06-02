import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async register(userDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: userDto.email }, { account: userDto.account }],
      });

      const keys = ["email", "account"];
      const conflictedAttributes = [];
      keys.forEach(key => {
        if (existingUser[key] === userDto[key]) {
          conflictedAttributes.push(key + " 已被註冊。");
        }
      });
      throw new ConflictException(conflictedAttributes);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
    }
    return this.usersService.create(userDto);
  }
}
