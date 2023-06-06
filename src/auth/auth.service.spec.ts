import { ConflictException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { dataSourceJest } from "src/config/data-source";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceJest)],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: UserEntity, // 使用測試資料庫的 Repository
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  describe("createUser - Data", () => {
    it("應該會創建 一個使用者", async () => {
      const test_data: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account1",
        password: "Password@123",
      };
      const errors = await validate(test_data);
      expect(errors.length).toBe(0);
      const user = await authService.register(test_data);

      expect(user).toBeDefined();
      expect(user.statusCode).toEqual(HttpStatus.CREATED);
      expect(user.message).toEqual("創建成功");
    });
    it("應該會發生 email、account 已被註冊衝突", async () => {
      const createUserDto1: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account",
        password: "Password@123",
      };
      try {
        await authService.register(createUserDto1);
        await authService.register(createUserDto1);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode: 409,
          message: ["email 已被註冊。", "account 已被註冊。"],
          error: "Conflict",
        });
      }
    });
    it("應該會發生 email 已被註冊衝突", async () => {
      const test_data1: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account1",
        password: "Password@123",
      };
      const test_data2: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account2",
        password: "Password@123",
      };
      const errors = await validate(test_data1);
      expect(errors.length).toBe(0);
      try {
        await authService.register(test_data1);
        await authService.register(test_data2);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode: 409,
          message: ["email 已被註冊。"],
          error: "Conflict",
        });
      }
    });
    it("應該會發生 account 已被註冊衝突", async () => {
      const test_data1: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account",
        password: "Password@123",
      };
      const test_data2: CreateUserDto = {
        email: "jhon2@gmail.com",
        name: "displayname",
        account: "account",
        password: "Password@123",
      };
      const errors = await validate(test_data1);
      expect(errors.length).toBe(0);
      try {
        await authService.register(test_data1);
        await authService.register(test_data2);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toEqual({
          statusCode: 409,
          message: ["account 已被註冊。"],
          error: "Conflict",
        });
      }
    });
  });
  afterEach(async () => {
    if (userRepository && userRepository.clear) {
      await userRepository.clear();
    }
  });
});
