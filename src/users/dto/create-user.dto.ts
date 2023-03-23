import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "User email",
    example: "jhon@gmail.com",
  })
  @IsEmail({}, { message: "email must be in mailbox format." })
  @IsNotEmpty({
    message: "email is required field.",
  })
  public readonly email: string;

  @ApiProperty({
    description: "User showname",
    example: "showname",
  })
  @IsNotEmpty({
    message: "name is required field.",
  })
  public readonly name: string;

  @ApiProperty({
    description: "User account",
    example: "account",
  })
  @IsNotEmpty({
    message: "account is required field.",
  })
  public readonly account: string;

  @ApiProperty({
    description: "User Password",
    example: "Password@123",
  })
  @IsNotEmpty({
    message: "password is required field.",
  })
  @Length(8, 24, {
    message: "password's length must be between 8-24 characters.",
  })
  public readonly password: string;

  @ApiProperty({
    description: "check password again",
    example: "Password@123",
  })
  @IsNotEmpty({
    message: "confirm is required field.",
  })
  @Length(8, 24, {
    message: "confirm's length must be between 8-24 characters.",
  })
  public readonly confirm: string;
}
export class CreateUserParam extends PickType(CreateUserDto, [
  "name",
  "email",
  "account",
  "password",
] as const) {}
