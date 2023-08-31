import { ConflictException, HttpStatus } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { type TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { dataSourceJest } from "src/config/data-source";
import jestConfig from "src/config/jest.config";
import type { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import type { Repository } from "typeorm";

import { AuthService } from "./auth.service";
import { type JwtUser } from "./jwt/jwt.interface";
import { JwtAccessStrategy } from "./jwt/jwt-access.strategy";
import { LocalStrategy } from "./local/local.strategy";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jestConfig],
        }),
        PassportModule,
        TypeOrmModule.forRoot(dataSourceJest),
        JwtModule.register({}),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          // 使用測試資料庫的 Repository
          useValue: UserEntity,
        },
        LocalStrategy,
        JwtAccessStrategy,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  describe("createUser - Data", () => {
    const rawUser: CreateUserDto = {
      account: "account1",
      email: "jhon@gmail.com",
      name: "displayname",
      password: "Password@123",
    };
    const rawUserConflictEmail: CreateUserDto = {
      account: "account2",
      email: "jhon@gmail.com",
      name: "displayname",
      password: "Password@123",
    };

    const rawUserConflictAccount: CreateUserDto = {
      account: "account",
      email: "jhon2@gmail.com",
      name: "displayname",
      password: "Password@123",
    };

    it("應該會創建 一個使用者", async () => {
      const user = await authService.register(rawUser);

      expect(user.statusCode).toEqual(HttpStatus.CREATED);
      expect(user.message).toEqual("創建成功");
    });

    it("應該會發生 email、account 已被註冊衝突", async () => {
      await authService.register(rawUser);
      await authService.register(rawUser).catch(error => {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          error: "Conflict",
          message: ["email 已被註冊。", "account 已被註冊。"],
          statusCode: 409,
        });
      });
    });

    it("應該會發生 email 已被註冊衝突", async () => {
      const errors = await validate(rawUser);

      expect(errors.length).toBe(0);
      await authService.register(rawUser);
      await authService.register(rawUserConflictEmail).catch(error => {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          error: "Conflict",
          message: ["email 已被註冊。"],
          statusCode: 409,
        });
      });
    });

    it("應該會發生 account 已被註冊衝突", async () => {
      const errors = await validate(rawUser);

      expect(errors.length).toBe(0);
      await authService.register(rawUser);
      await authService.register(rawUserConflictAccount).catch(error => {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          error: "Conflict",
          message: ["account 已被註冊。"],
          statusCode: 409,
        });
      });
    });
  });

  describe("user local login", () => {
    const fakeAccessToken = "mocked_access_token";
    const fakeRefreshToken = "mocked_refresh_token";
    const mockUser: Partial<UserEntity> = {
      account: "test",
      email: "test@example.com",
      id: 1,
      name: "test",
      password: "$2b$05$zc4SaUDmE68OgrabgSoLX.CDMHZ8SD/aDeuJc7rxKmtqjP5WpH.Me",
    };
    const mockJwtUser: JwtUser = {
      id: 1,
    };

    beforeEach(async () => {
      jest
        .spyOn(authService, "generateAccessToken")
        .mockReturnValue(Promise.resolve(fakeAccessToken));

      jest
        .spyOn(authService, "generateRefreshToken")
        .mockReturnValue(Promise.resolve(fakeRefreshToken));
    });

    it("should be login successfully.", async () => {
      const expectedStatusCode = HttpStatus.CREATED;

      const result = await authService.sign(mockJwtUser);

      expect(result).toEqual({
        accessToken: fakeAccessToken,
        refreshToken: fakeRefreshToken,
        statusCode: expectedStatusCode,
      });
    });

    it("should be validate successfully.", async () => {
      const mockAccount = "test";
      const mockPassword = "Password@123";

      jest
        .spyOn(userService, "findOne")
        .mockImplementation(async () => mockUser as UserEntity);

      const result = await authService.validateUser(mockAccount, mockPassword);

      expect(result).toEqual({
        id: mockUser.id,
      });
    });

    it("when the account does not exist should be validate failure.", async () => {
      const mockAccount = "test";
      const mockPassword = "Password@123";

      jest.spyOn(userService, "findOne").mockImplementation(async () => null);

      const result = await authService.validateUser(mockAccount, mockPassword);

      expect(result).toEqual(null);
    });

    it("when the account exist but password not correct should be validate failure.", async () => {
      const mockAccount = "test";
      const mockPassword = "Password@1234";

      jest
        .spyOn(userService, "findOne")
        .mockImplementation(async () => mockUser as UserEntity);

      const result = await authService.validateUser(mockAccount, mockPassword);

      expect(result).toEqual(null);
    });
  });

  describe("generate Token", () => {
    const userId = 1;
    const payload: JwtUser = {
      id: userId,
    };

    it("should generate access token", async () => {
      const result = await authService.generateAccessToken(payload);

      expect(result).toBeDefined();
    });

    it("should generate refresh token", async () => {
      const result = await authService.generateRefreshToken(payload);

      expect(result).toBeDefined();
    });
  });

  afterEach(async () => {
    await userRepository.clear();
  });
});
