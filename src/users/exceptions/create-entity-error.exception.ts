import { ApiProperty } from "@nestjs/swagger";

export class CreateEntityUserError {
  @ApiProperty({
    type: "number",
    description: "HTTP StatusCode",
    example: "422",
  })
  public readonly StatusCode: number;

  @ApiProperty({
    type: "array",
    description: "Error Message",
    items: {
      properties: {
        email: {
          description:
            "email is required field.  \n" +
            "email must be in mailbox format.  \n",
          type: "string",
        },
        name: {
          description: "name is required field.  \n",
          type: "string",
        },
        account: {
          description: "account is required field.  \n",
          type: "string",
        },
        password: {
          description:
            "password is required field.  \n" +
            "password's length must be between 8-24 characters.  \n" +
            "password Should contain 1 uppercase letter, 1 lowercase letter plus numbers and special characters.  \n",

          type: "string",
        },
        confirm: {
          description:
            "confirm is required field.  \n" +
            "confirm's length must be between 8-24 characters.  \n" +
            "confirm Should contain 1 uppercase letter, 1 lowercase letter plus numbers and special characters.  \n",
          type: "string",
        },
      },
    },
    example: "email is required field.",
  })
  public readonly error: string[];
}
