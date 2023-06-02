import { ApiProperty } from "@nestjs/swagger";

export class CreateUserBadrequestError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "400",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "錯誤訊息",
    items: {
      properties: {
        email: {
          description: "email 為必填欄位。  \n" + "email 必須是信箱格式。  \n",
          type: "string",
        },
        name: {
          description: "name 為必填欄位。  \n",
          type: "string",
        },
        account: {
          description: "account 為必填欄位。  \n",
          type: "string",
        },
        password: {
          description:
            "password 為必填欄位。  \n" +
            "password 必須長度大於等於8個字。  \n",
          type: "string",
        },
      },
    },
    example: [
      "email 為必填欄位。",
      "email 必須是信箱格式。",
      "name 為必填欄位。",
      "account 為必填欄位。",
      "password 為必填欄位。",
      "password 必須長度大於等於8個字。",
    ],
  })
  public readonly message: string[];

  @ApiProperty({
    type: "string",
    description: "錯誤狀態碼敘述",
    example: "Bad Request",
  })
  public readonly error: string;
}
