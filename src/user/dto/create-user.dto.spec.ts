import { type ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validationPipe } from "src/pipes/validation-pipe";

import { CreateUserDto } from "./create-user.dto";

describe("createUser-DTO", () => {
  it("應該會發生 email 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      account: "account",
      email: "",
      name: "displayname",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      data: "@Body()",
      metatype: CreateUserDto,
      type: "body",
    };

    await validationPipe
      .transform(createUserDto, metadata)
      .catch((error: BadRequestException) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: "Bad Request",
          message: ["email 為必填欄位。", "email 必須是信箱格式。"],
          statusCode: 400,
        });
      });
  });

  it("應該會發生 email 欄位格式驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      account: "account",
      email: "jhon",
      name: "displayname",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      data: "@Body()",
      metatype: CreateUserDto,
      type: "body",
    };

    await validationPipe
      .transform(createUserDto, metadata)
      .catch((error: BadRequestException) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: "Bad Request",
          message: ["email 必須是信箱格式。"],
          statusCode: 400,
        });
      });
  });

  it("應該會發生 name 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      account: "account",
      email: "jhon@gmail.com",
      name: "",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      data: "@Body()",
      metatype: CreateUserDto,
      type: "body",
    };

    await validationPipe
      .transform(createUserDto, metadata)
      .catch((error: BadRequestException) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: "Bad Request",
          message: ["name 為必填欄位。"],
          statusCode: 400,
        });
      });
  });

  it("應該會發生 account 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      account: "",
      email: "jhon@gmail.com",
      name: "displayname",
      password: "Password@123",
    };
    const metadata: ArgumentMetadata = {
      data: "@Body()",
      metatype: CreateUserDto,
      type: "body",
    };

    await validationPipe
      .transform(createUserDto, metadata)
      .catch((error: BadRequestException) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: "Bad Request",
          message: ["account 為必填欄位。"],
          statusCode: 400,
        });
      });
  });

  it("應該會發生 password 欄位未填驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      account: "account",
      email: "jhon@gmail.com",
      name: "displayname",
      password: "",
    };
    const metadata: ArgumentMetadata = {
      data: "@Body()",
      metatype: CreateUserDto,
      type: "body",
    };

    await validationPipe
      .transform(createUserDto, metadata)
      .catch((error: BadRequestException) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: "Bad Request",
          message: [
            "password 必須長度大於等於8個字。",
            "password 為必填欄位。",
          ],
          statusCode: 400,
        });
      });
  });

  it("應該會發生 password 欄位長度驗證失敗", async () => {
    const createUserDto: CreateUserDto = {
      account: "account",
      email: "jhon@gmail.com",
      name: "displayname",
      password: "123",
    };
    const metadata: ArgumentMetadata = {
      data: "@Body()",
      metatype: CreateUserDto,
      type: "body",
    };

    await validationPipe
      .transform(createUserDto, metadata)
      .catch((error: BadRequestException) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: "Bad Request",
          message: ["password 必須長度大於等於8個字。"],
          statusCode: 400,
        });
      });
  });
});
