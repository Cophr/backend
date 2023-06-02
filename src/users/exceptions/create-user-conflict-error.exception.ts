import { ApiProperty } from "@nestjs/swagger";

export class CreateUserConflictError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "409",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "錯誤訊息",
    items: {
      properties: {
        email: {
          description: "email 已被註冊。  \n",
          type: "string",
        },
        name: {
          description: "name 已被註冊。  \n",
          type: "string",
        },
        account: {
          description: "account 已被註冊。 \n",
          type: "string",
        },
      },
    },
    example: ["email 已被註冊。", "account 已被註冊。"],
  })
  public readonly message: string[];

  @ApiProperty({
    type: "string",
    description: "錯誤狀態碼敘述",
    example: "Conflict",
  })
  public readonly error: string;
}
