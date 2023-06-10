import {
  type HttpException,
  ConflictException,
  HttpStatus,
} from "@nestjs/common";
import { type TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { dataSourceJest } from "src/config/data-source";
import type { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import type { Repository } from "typeorm";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity> | undefined;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceJest)],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          // 使用測試資料庫的 Repository
          useValue: UserEntity,
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
      const rawUser: CreateUserDto = {
        account: "account1",
        email: "jhon@gmail.com",
        name: "displayname",
        password: "Password@123",
      };
      const user = await authService.register(rawUser);

      expect(user).toBeDefined();
      expect(user.statusCode).toEqual(HttpStatus.CREATED);
      expect(user.message).toEqual("創建成功");
    });

    it("應該會發生 email、account 已被註冊衝突", async () => {
      const createUserDto1: CreateUserDto = {
        account: "account",
        email: "jhon@gmail.com",
        name: "displayname",
        password: "Password@123",
      };

      await authService.register(createUserDto1);
      await authService
        .register(createUserDto1)
        .catch((error: HttpException) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.getResponse()).toEqual({
            error: "Conflict",
            message: ["email 已被註冊。", "account 已被註冊。"],
            statusCode: 409,
          });
        });
    });

    it("應該會發生 email 已被註冊衝突", async () => {
      const rawUser1: CreateUserDto = {
        account: "account1",
        email: "jhon@gmail.com",
        name: "displayname",
        password: "Password@123",
      };
      const rawUser2: CreateUserDto = {
        account: "account2",
        email: "jhon@gmail.com",
        name: "displayname",
        password: "Password@123",
      };
      const errors = await validate(rawUser1);

      expect(errors.length).toBe(0);
      await authService.register(rawUser1);
      await authService.register(rawUser2).catch((error: HttpException) => {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toEqual({
          error: "Conflict",
          message: ["email 已被註冊。"],
          statusCode: 409,
        });
      });
    });

    it("應該會發生 account 已被註冊衝突", async () => {
      const rawUser1: CreateUserDto = {
        account: "account",
        email: "jhon@gmail.com",
        name: "displayname",
        password: "Password@123",
      };
      const rawUser2: CreateUserDto = {
        account: "account",
        email: "jhon2@gmail.com",
        name: "displayname",
        password: "Password@123",
      };
      const errors = await validate(rawUser1);

      expect(errors.length).toBe(0);
      await authService.register(rawUser1);
      await authService.register(rawUser2).catch((error: HttpException) => {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toEqual({
          error: "Conflict",
          message: ["account 已被註冊。"],
          statusCode: 409,
        });
      });
    });
  });

  afterEach(async () => {
    await userRepository?.clear();
  });
});
