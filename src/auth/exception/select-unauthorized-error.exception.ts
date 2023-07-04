import { ApiProperty } from "@nestjs/swagger";

export class SelectUnauthorizedError {
  @ApiProperty({
    description: "HTTP Code",
    example: "401",
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "Error message",
    example: "Unauthorized",
    type: "string",
  })
  public readonly message: string;
}
