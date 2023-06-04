import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { dataSourceJest } from "src/config/data-source";
import { UserEntity } from "src/users/entities/user.entity";
import { CreateUserRespose } from "src/users/resposes/create-user-respose";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

import { CreateUserDto } from "../users/dto/create-user.dto";
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
        UsersService,
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
  describe("createUser - DTO", () => {
    it("應該會發生 email 欄位未填驗證失敗", async () => {
      const test_data: CreateUserDto = {
        email: "",
        name: "displayname",
        account: "account",
        password: "Password@123",
      };

      const Dto = plainToInstance(CreateUserDto, test_data);
      const errors = await validate(Dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(
        "isNotEmpty",
        "email 為必填欄位。",
      );
    });
    it("應該會發生 email 欄位格式驗證失敗", async () => {
      const test_data: CreateUserDto = {
        email: "jhon",
        name: "displayname",
        account: "account",
        password: "Password@123",
      };
      const Dto = plainToInstance(CreateUserDto, test_data);
      const errors = await validate(Dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(
        "isEmail",
        "email 必須是信箱格式。",
      );
    });
    it("應該會發生 name 欄位未填驗證失敗", async () => {
      const test_data: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "",
        account: "account",
        password: "Password@123",
      };

      const Dto = plainToInstance(CreateUserDto, test_data);
      const errors = await validate(Dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(
        "isNotEmpty",
        "name 為必填欄位。",
      );
    });
    it("應該會發生 account 欄位未填驗證失敗", async () => {
      const test_data: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "",
        password: "Password@123",
      };

      const Dto = plainToInstance(CreateUserDto, test_data);
      const errors = await validate(Dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(
        "isNotEmpty",
        "account 為必填欄位。",
      );
    });
    it("應該會發生 password 欄位未填驗證失敗", async () => {
      const test_data: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account",
        password: "",
      };

      const Dto = plainToInstance(CreateUserDto, test_data);
      const errors = await validate(Dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(
        "isNotEmpty",
        "password 為必填欄位。",
      );
    });
    it("應該會發生 password 欄位長度驗證失敗", async () => {
      const test_data: CreateUserDto = {
        email: "jhon@gmail.com",
        name: "displayname",
        account: "account",
        password: "123",
      };

      const Dto = plainToInstance(CreateUserDto, test_data);
      const errors = await validate(Dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(
        "minLength",
        "password 必須長度大於等於8個字。",
      );
    });
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
    afterEach(async () => {
      if (userRepository && userRepository.clear) {
        await userRepository.clear();
      }
    });
  });
});
