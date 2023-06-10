import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRespose {
  @ApiProperty({
    description: "HTTP 回應代碼",
    example: "201",
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "創建成功回應",
    example: "創建成功",
    type: "number",
  })
  public readonly message: string;
}
