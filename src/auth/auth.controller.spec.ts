import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceJest } from "src/config/data-source";
import { UserEntity } from "src/user/entities/user.entity";
import { CreateUserRespose } from "src/user/resposes/create-user-respose";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceJest)],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: UserEntity, // 使用測試資料庫的 Repository
        },
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
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account",
        password: "Password@123",
      };
      const expectedResponse: CreateUserRespose = {
        statusCode: 201,
        message: "創建成功",
      };
      jest.spyOn(authService, "register").mockResolvedValue(expectedResponse);
      const result = await authController.register(createUserDto);
      expect(result).toEqual(expectedResponse);
    });
    it("應該會發生資料使用者重覆，並返回 409 狀態碼", async () => {
      const createUserDto1: CreateUserDto = {
        email: "jhon1@gmail.com",
        name: "displayname",
        account: "account1",
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
  });
  afterEach(async () => {
    if (userRepository && userRepository.clear) {
      await userRepository.clear();
    }
  });
});
