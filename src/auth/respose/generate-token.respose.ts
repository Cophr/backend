import { ApiProperty } from "@nestjs/swagger";

export class GenerateTokenRespose {
  @ApiProperty({
    description: "Generate accessToken",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impob25AZ21haWwuY29tIiwiaWQiOjIsImlhdCI6MTY4ODQ2Mzc4OCwiZXhwIjoxNjg4NTUwMTg4fQ.F3YqRedhg62eXpJ946OOTE52Y5-GIYHC8GTtT8JNMc8",
    type: "string",
  })
  public readonly accessToken: string;

  @ApiProperty({
    description: "HTTP Code",
    example: "201",
    type: "number",
  })
  public readonly statusCode: number;
}
