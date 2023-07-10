import {
  type HttpException,
  ConflictException,
  HttpStatus,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { type TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { dataSourceJest } from "src/config/data-source";
import jestConfig from "src/config/jest.config";
import { jwtConfig } from "src/config/jwt.config";
import type { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import type { Repository } from "typeorm";

import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { LocalStrategy } from "./local/local.strategy";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: Repository<UserEntity> | undefined;

  const fakeAccessToken = "mocked_token";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jestConfig],
        }),
        PassportModule,
        TypeOrmModule.forRoot(dataSourceJest),
        JwtModule.registerAsync(jwtConfig),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          // 使用測試資料庫的 Repository
          useValue: UserEntity,
        },
        {
          provide: JwtService,
          useValue: {
            // 模拟JwtService中的方法
            sign: jest.fn().mockReturnValue(fakeAccessToken),
          },
        },
        LocalStrategy,
        JwtStrategy,
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
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

  describe("user local login", () => {
    it("should be login successfully.", async () => {
      const mockUser = {
        email: "test@example.com",
        id: 1,
      };
      const expectedToken = fakeAccessToken;
      const expectedStatusCode = HttpStatus.CREATED;

      jest.spyOn(jwtService, "sign").mockReturnValue(expectedToken);

      const result = await authService.login(mockUser);

      expect(result).toEqual({
        accessToken: expectedToken,
        statusCode: expectedStatusCode,
      });
    });

    it("should be validate successfully.", async () => {
      const mockAccount = "test";
      const mockPassword = "Password@123";
      const mockUser: Partial<UserEntity> = {
        account: "test",
        email: "test@example.com",
        id: 1,
        name: "test",
        password:
          "$2b$05$zc4SaUDmE68OgrabgSoLX.CDMHZ8SD/aDeuJc7rxKmtqjP5WpH.Me",
      };

      jest
        .spyOn(userService, "findOne")
        .mockImplementation(async () => mockUser as UserEntity);

      const result = await authService.validateUser(mockAccount, mockPassword);

      expect(result).toBeDefined();
      expect(result).toEqual({
        id: mockUser.id,
      });
    });

    it("should be validate failure.", async () => {
      const mockAccount = "test";
      const mockPassword = "Password@123";

      jest.spyOn(userService, "findOne").mockImplementation(async () => null);

      const result = await authService.validateUser(mockAccount, mockPassword);

      expect(result).toBeDefined();
      expect(result).toEqual(null);
    });
  });

  afterEach(async () => {
    await userRepository?.clear();
  });
});
