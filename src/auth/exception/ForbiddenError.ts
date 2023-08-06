import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenError {
  @ApiProperty({
    description: "HTTP Code",
    example: "403",
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "Error message",
    example: "Forbidden",
    type: "string",
  })
  public readonly message: string;
}
