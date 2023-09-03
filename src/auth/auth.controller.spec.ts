import { ConflictException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { type TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { type Request } from "express";
import { dataSourceJest } from "src/config/data-source";
import jestConfig from "src/config/jest.config";
import { UserEntity } from "src/user/entities/user.entity";
import type { CreateUserResponse } from "src/user/responses/create-user-response";
import { UserService } from "src/user/user.service";
import type { Repository } from "typeorm";

import type { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { type JwtUser } from "./jwt/jwt.interface";
import { JwtAccessStrategy } from "./jwt/jwt-access.strategy";
import { LocalStrategy } from "./local/local.strategy";
import { type GenerateTokenResponse } from "./responses/generate-token.response";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: Repository<UserEntity> | undefined;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  describe("create", () => {
    const createUserDto: CreateUserDto = {
      account: "account",
      email: "jhon@gmail.com",
      name: "displayname",
      password: "Password@123",
    };
    let mockedAuthService: jest.SpyInstance;

    beforeEach(async () => {
      mockedAuthService = jest.spyOn(authService, "register");
    });

    it("應該會創建一個使用者，並返回 201 狀態碼", async () => {
      const expectedResponse: CreateUserResponse = {
        message: "創建成功",
        statusCode: 201,
      };

      mockedAuthService.mockResolvedValue(expectedResponse);

      const result = await authController.register(createUserDto);

      expect(result).toEqual(expectedResponse);
    });

    it("應該會發生資料使用者重覆，並返回 409 狀態碼", async () => {
      await authService.register(createUserDto);
      await authService.register(createUserDto).catch(error => {
        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toEqual({
          error: "Conflict",
          message: ["email 已被註冊。", "account 已被註冊。"],
          statusCode: 409,
        });
      });
    });
  });

  describe("login and refresh", () => {
    const request: Request = {
      user: {
        id: 1,
      } as JwtUser,
    } as unknown as Request;
    const fakeAccessToken = "mocked_access_token";
    const fakeRefreshToken = "mocked_refresh_token";
    let mockedAuthService: jest.SpyInstance;

    beforeEach(async () => {
      jest
        .spyOn(authService, "generateAccessToken")
        .mockReturnValue(Promise.resolve(fakeAccessToken));

      jest
        .spyOn(authService, "generateRefreshToken")
        .mockReturnValue(Promise.resolve(fakeRefreshToken));

      mockedAuthService = jest.spyOn(authService, "sign");
    });

    it("should return access, refresh token and 201 http code when account information is correct.", async () => {
      const result = await authController.login(request);

      expect(mockedAuthService).toHaveBeenCalledWith(request.user);
      const expectedResponse: GenerateTokenResponse = {
        accessToken: fakeAccessToken,
        refreshToken: fakeRefreshToken,
        statusCode: 201,
      };

      expect(result).toEqual(expectedResponse);
    });

    it("should return access, refresh token and 201 http code when refresh token is correct.", async () => {
      const result = await authController.refresh(request);

      expect(mockedAuthService).toHaveBeenCalledWith(request.user);
      const expectedResponse: GenerateTokenResponse = {
        accessToken: fakeAccessToken,
        refreshToken: fakeRefreshToken,
        statusCode: 201,
      };

      expect(result).toEqual(expectedResponse);
    });
  });

  afterEach(async () => {
    await userRepository?.clear();
  });
});
