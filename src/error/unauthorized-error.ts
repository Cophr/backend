import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedError {
  @ApiProperty({
    description: "HTTP Code",
    example: 401,
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "Error Message",
    example: "Unauthorized",
    type: "string",
  })
  public readonly error: string;
}
