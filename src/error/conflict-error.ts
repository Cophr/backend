import { ApiProperty } from "@nestjs/swagger";

export class ConflictError {
  @ApiProperty({
    description: "HTTP Code",
    example: 409,
    type: "number",
  })
  public readonly statusCode: number;

  @ApiProperty({
    description: "Error Message",
    example: ["Error Message"],
    type: "array",
  })
  public readonly error: string[];
}
