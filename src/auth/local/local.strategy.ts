import { ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { AuthService } from "../auth.service";
import { type JwtUser } from "../jwt/jwt.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "account" });
  }

  async validate(account: string, password: string) {
    const user = await this.authService.validateUser(account, password);

    if (!user) {
      throw new ForbiddenException({
        message: ["Account or password is wrong."],
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
    const payload: JwtUser = {
      id: user.id,
    };

    return payload;
  }
}
