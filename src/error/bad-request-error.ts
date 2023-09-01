import { ApiProperty } from "@nestjs/swagger";

export class BadRequestError {
  @ApiProperty({
    description: "HTTP Code",
    example: 400,
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
