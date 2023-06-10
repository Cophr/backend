import { HttpStatus, ValidationPipe } from "@nestjs/common";

export const validationPipe = new ValidationPipe({
  disableErrorMessages: false,
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  stopAtFirstError: false,
  transform: true,
  whitelist: true,
});
