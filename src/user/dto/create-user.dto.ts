import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "使用者信箱",
    example: "jhon@gmail.com",
  })
  @IsEmail({}, { message: "email 必須是信箱格式。" })
  @IsNotEmpty({
    message: "email 為必填欄位。",
  })
  public readonly email: string;

  @ApiProperty({
    description: "顯示名",
    example: "displayname",
  })
  @IsNotEmpty({
    message: "name 為必填欄位。",
  })
  public readonly name: string;

  @ApiProperty({
    description: "登入用帳號名",
    example: "account",
  })
  @IsNotEmpty({
    message: "account 為必填欄位。",
  })
  public readonly account: string;

  @ApiProperty({
    description: "使用者密碼",
    example: "Password@123",
  })
  @IsNotEmpty({
    message: "password 為必填欄位。",
  })
  @MinLength(8, { message: "password 必須長度大於等於8個字。" })
  public readonly password: string;
}
