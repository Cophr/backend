import { HttpStatus } from "@nestjs/common";
import { type TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceJest } from "src/config/data-source";
import { type Repository } from "typeorm";

import type { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceJest)],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          // 使用測試資料庫的 Repository
          useValue: UserEntity,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it("應該會創建 一個使用者", async () => {
    const rawUser: CreateUserDto = {
      account: "account1",
      email: "jhon@gmail.com",
      name: "displayname",
      password: "Password@123",
    };
    const user = await userService.create(rawUser);

    expect(user).toBeDefined();
    expect(user.statusCode).toEqual(HttpStatus.CREATED);
    expect(user.message).toEqual("創建成功");
  });

  it("should be found a user", async () => {
    const account = "test";
    const mockUser: Partial<UserEntity> = {
      account: "test",
      email: "test@example.com",
      id: 1,
      name: "test",
      password: "$2b$05$zc4SaUDmE68OgrabgSoLX.CDMHZ8SD/aDeuJc7rxKmtqjP5WpH.Me",
    };

    jest
      .spyOn(userRepository, "findOne")
      .mockResolvedValue(mockUser as UserEntity);

    const user = await userService.findOne(account);

    expect(user).toBeDefined();
    expect(user).toEqual(mockUser);
  });

  afterEach(async () => {
    await userRepository.clear();
  });
});
