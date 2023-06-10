import { ApiProperty } from "@nestjs/swagger";

export class CreateUserConflictError {
  @ApiProperty({
    description: "HTTP 回應代碼",
    example: "409",
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "錯誤訊息",
    example: ["email 已被註冊。", "account 已被註冊。"],
    items: {
      properties: {
        account: {
          description: "account 已被註冊。 \n",
          type: "string",
        },
        email: {
          description: "email 已被註冊。  \n",
          type: "string",
        },
      },
    },
    type: "array",
  })
  public readonly message: string[];

  @ApiProperty({
    description: "錯誤狀態碼敘述",
    example: "Conflict",
    type: "string",
  })
  public readonly error: string;
}
