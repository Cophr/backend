import { ApiProperty } from "@nestjs/swagger";

export class CreateUserResponse {
  @ApiProperty({
    description: "HTTP 回應代碼",
    example: 201,
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "創建成功回應",
    example: "創建成功",
    type: "string",
  })
  public readonly message: string;
}
