import { ApiProperty } from "@nestjs/swagger";

export class CreateUserBadrequestError {
  @ApiProperty({
    description: "HTTP 回應代碼",
    example: "400",
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "錯誤訊息",
    example: [
      "email 為必填欄位。",
      "email 必須是信箱格式。",
      "name 為必填欄位。",
      "account 為必填欄位。",
      "password 為必填欄位。",
      "password 必須長度大於等於8個字。",
    ],
    items: {
      properties: {
        account: {
          description: "account 為必填欄位。  \n",
          type: "string",
        },
        email: {
          // eslint-disable-next-line no-useless-concat
          description: "email 為必填欄位。  \n" + "email 必須是信箱格式。  \n",
          type: "string",
        },
        name: {
          description: "name 為必填欄位。  \n",
          type: "string",
        },
        password: {
          // eslint-disable-next-line no-useless-concat
          description:
            "password 為必填欄位。  \n" +
            "password 必須長度大於等於8個字。  \n",
          type: "string",
        },
      },
    },
    type: "array",
  })
  public readonly message: string[];

  @ApiProperty({
    description: "錯誤狀態碼敘述",
    example: "Bad Request",
    type: "string",
  })
  public readonly error: string;
}
