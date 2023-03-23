import { ApiProperty } from "@nestjs/swagger";

export class CreateConflictUserError {
  @ApiProperty({
    type: "number",
    description: "HTTP StatusCode",
    example: "409",
  })
  public readonly StatusCode: number;

  @ApiProperty({
    type: "array",
    description: "Error Message",
    items: {
      properties: {
        email: {
          description: "email has been registered.  \n",
          type: "string",
        },
        name: {
          description: "name has been registered.  \n",
          type: "string",
        },
        account: {
          description: "account has been registered. \n",
          type: "string",
        },
        password: {
          description:
            "Confirm and password do not match, please try again.  \n",

          type: "string",
        },
      },
    },
    example: "email has been registered.",
  })
  public readonly error: string[];
}
