import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validationPipe } from "src/pipes/validation-pipe";

import { CreateUserDto } from "./create-user.dto";

describe("createUser-DTO", () => {
  it("應該會發生 email 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      email: "",
      name: "displayname",
      account: "account",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: CreateUserDto,
      data: "@Body()",
    };
    await validationPipe.transform(createUserDto, metadata).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        statusCode: 400,
        message: ["email 為必填欄位。", "email 必須是信箱格式。"],
        error: "Bad Request",
      });
    });
  });
  it("應該會發生 email 欄位格式驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      email: "jhon",
      name: "displayname",
      account: "account",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: CreateUserDto,
      data: "@Body()",
    };
    await validationPipe.transform(createUserDto, metadata).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        statusCode: 400,
        message: ["email 必須是信箱格式。"],
        error: "Bad Request",
      });
    });
  });
  it("應該會發生 name 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      email: "jhon@gmail.com",
      name: "",
      account: "account",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: CreateUserDto,
      data: "@Body()",
    };
    await validationPipe.transform(createUserDto, metadata).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        statusCode: 400,
        message: ["name 為必填欄位。"],
        error: "Bad Request",
      });
    });
  });
  it("應該會發生 account 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      email: "jhon@gmail.com",
      name: "displayname",
      account: "",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: CreateUserDto,
      data: "@Body()",
    };
    await validationPipe.transform(createUserDto, metadata).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        statusCode: 400,
        message: ["account 為必填欄位。"],
        error: "Bad Request",
      });
    });
  });
  it("應該會發生 password 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      email: "jhon@gmail.com",
      name: "displayname",
      account: "account",
      password: "",
    };
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: CreateUserDto,
      data: "@Body()",
    };
    await validationPipe.transform(createUserDto, metadata).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        statusCode: 400,
        message: ["password 必須長度大於等於8個字。", "password 為必填欄位。"],
        error: "Bad Request",
      });
    });
  });
  it("應該會發生 password 欄位長度驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      email: "jhon@gmail.com",
      name: "displayname",
      account: "account",
      password: "123",
    };
    const metadata: ArgumentMetadata = {
      type: "body",
      metatype: CreateUserDto,
      data: "@Body()",
    };
    await validationPipe.transform(createUserDto, metadata).catch(error => {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual({
        statusCode: 400,
        message: ["password 必須長度大於等於8個字。"],
        error: "Bad Request",
      });
    });
  });
});
