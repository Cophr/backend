import {
  type HttpException,
  ConflictException,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { type TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceJest } from "src/config/data-source";
import jestConfig from "src/config/jest.config";
import { jwtConfig } from "src/config/jwt.config";
import { UserEntity } from "src/user/entities/user.entity";
import type { CreateUserRespose } from "src/user/resposes/create-user-respose";
import { UserService } from "src/user/user.service";
import type { Repository } from "typeorm";

import type { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { LocalStrategy } from "./local/local.strategy";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: Repository<UserEntity> | undefined;
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
            sign: jest.fn().mockReturnValue("mocked_token"),
          },
        },
        LocalStrategy,
        JwtStrategy,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  describe("create", () => {
    it("應該會創建一個使用者，並返回 201 狀態碼", async () => {
      const createUserDto: CreateUserDto = {
        account: "account",
        email: "jhon@gmail.com",
        name: "displayname",
        password: "Password@123",
      };
      const expectedResponse: CreateUserRespose = {
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
      const expectedResult = {
        accessToken: "mocked_token",
        statusCode: HttpStatus.CREATED,
      };

      jest
        .spyOn(localStrategy, "validate")
        .mockResolvedValue({ email: "test@example.com", id: 1 });

      const result = await authController.login(localStrategy);

      expect(result).toEqual(expectedResult);
    });

    it("should return Unauthorized and 401 http code when account information is failure.", async () => {
      jest.spyOn(localStrategy, "validate").mockImplementation(() => {
        throw new UnauthorizedException();
      });

      jest
        .spyOn(authService, "login")
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(localStrategy)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  afterEach(async () => {
    await userRepository?.clear();
  });
});
