import { HttpStatus, ValidationPipe } from "@nestjs/common";

const PASSWORD_RULE =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const PASSWORD_RULE_MESSAGE =
  " 應包含 1 個大寫字母、1 個小寫字母以及數字和特殊字符。";
//Password should have 1 upper case, lowcase letter along with a number and special character.
const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  stopAtFirstError: false,
  disableErrorMessages: false,
  whitelist: true,
});

export const REGEX = {
  PASSWORD_RULE,
};

export const MESSAGES = {
  PASSWORD_RULE_MESSAGE,
};

export const SETTINGS = {
  VALIDATION_PIPE,
};
