import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceJest } from "src/config/data-source";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceJest)],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: UserEntity, // 使用測試資料庫的 Repository
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it("應該會創建 一個使用者", async () => {
    const test_data: CreateUserDto = {
      email: "jhon@gmail.com",
      name: "displayname",
      account: "account1",
      password: "Password@123",
    };
    const user = await userService.create(test_data);

    expect(user).toBeDefined();
    expect(user.statusCode).toEqual(HttpStatus.CREATED);
    expect(user.message).toEqual("創建成功");
  });
});
