import { ApiProperty } from "@nestjs/swagger";

export class CreateEntityUserError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "422",
  })
  public readonly StatusCode: number;

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
            "password 必須長度大於等於8個字。  \n" +
            "password 應包含 1 個大寫字母、1 個小寫字母以及數字和特殊字符。  \n",

          type: "string",
        },
        confirm: {
          description:
            "confirm 為必填欄位。  \n" +
            "confirm 必須長度大於等於8個字。  \n" +
            "confirm 應包含 1 個大寫字母、1 個小寫字母以及數字和特殊字符。  \n",
          type: "string",
        },
      },
    },
    example: "email 為必填欄位。",
  })
  public readonly error: string[];
}
