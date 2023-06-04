import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { CreateUserDto } from "../users/dto/create-user.dto";

describe("AuthController", () => {
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
});
