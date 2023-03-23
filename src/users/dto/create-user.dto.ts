import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

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
    example: "showname",
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
  @Length(8, 24, { message: "password 長度必須於8-24個字元之間。" })
  public readonly password: string;

  @ApiProperty({
    description: "再次確認密碼",
    example: "Password@123",
  })
  @IsNotEmpty({
    message: "confirm 為必填欄位。",
  })
  @Length(8, 24, { message: "confirm 必須長度大於等於8個字。" })
  public readonly confirm: string;
}
export class CreateUserParam extends PickType(CreateUserDto, [
  "name",
  "email",
  "account",
  "password",
] as const) {}
