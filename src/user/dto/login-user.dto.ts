import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: "email or account as login account.",
    example: "account",
  })
  @IsNotEmpty({
    message: "account field should not be empty.",
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
