import { type HttpException, ConflictException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { type TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { type Request } from "express";
import { dataSourceJest } from "src/config/data-source";
import jestConfig from "src/config/jest.config";
import { jwtAccessConfig } from "src/config/jwt.config";
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

  const fakeAccessToken = "mocked_token";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ConfigModule.forRoot({
          load: [jestConfig],
        }),
        PassportModule,
        TypeOrmModule.forRoot(dataSourceJest),
        JwtModule.registerAsync(jwtAccessConfig),
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
            sign: jest.fn().mockReturnValue(fakeAccessToken),
          },
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
    it("應該會創建一個使用者，並返回 201 狀態碼", async () => {
      const createUserDto: CreateUserDto = {
        account: "account",
        email: "jhon@gmail.com",
        name: "displayname",
        password: "Password@123",
      };
      const expectedResponse: CreateUserResponse = {
        message: "創建成功",
        statusCode: 201,
      };

      jest.spyOn(authService, "register").mockResolvedValue(expectedResponse);
      const result = await authController.register(createUserDto);

      expect(result).toEqual(expectedResponse);
    });

    it("應該會發生資料使用者重覆，並返回 409 狀態碼", async () => {
      const createUserDto1: CreateUserDto = {
        account: "account1",
        email: "jhon1@gmail.com",
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

    it("should return a token and 201 http code when account information is correct.", async () => {
      const request: Request = {
        user: {
          id: 1,
        } as JwtUser,
      } as unknown as Request;
      const mockAuthService = jest.spyOn(authService, "login");

      const result = await authController.login(request);

      expect(mockAuthService).toHaveBeenCalledWith(request.user);

      const expectedResponse: GenerateTokenResponse = {
        accessToken: fakeAccessToken,
        statusCode: 201,
      };

      expect(result).toEqual(expectedResponse);
    });
  });

  afterEach(async () => {
    await userRepository?.clear();
  });
});
