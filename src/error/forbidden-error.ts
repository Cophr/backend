import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenError {
  @ApiProperty({
    description: "HTTP Code",
    example: 403,
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "Error Message",
    example: "Error Message",
    type: "string",
  })
  public readonly error: string;
}
