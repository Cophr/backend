import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {
  type Profile,
  type VerifyCallback,
  Strategy,
} from "passport-google-oauth20";

import { type GoogleProfile } from "./google.profile";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(configService: ConfigService) {
    const appURL: string | undefined =
      configService.get("app.url") ?? "http://localhost:3000";
    const callbackURL = `${appURL}/auth/google/redirect`;

    const clientID: string | undefined = configService.get("google.clientId");
    const clientSecret: string | undefined = configService.get(
      "google.clientSecret",
    );
    const scopeList: string | undefined = configService.get("google.scope");
    const scope = scopeList?.split(",");

    super({
      callbackURL,
      clientID,
      clientSecret,
      scope,
    });
  }

  authorizationParams(): Record<string, string> {
    return {
      // eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
      access_type: "offline",
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { provider, _json } = profile;
    const user: GoogleProfile = {
      accessToken,
      displayName: _json.name ?? "",
      email: _json.email ?? "",
      emailVerified: _json.email_verified ?? "",
      externalId: _json.sub,
      firstName: _json.given_name ?? "",
      lastName: _json.family_name ?? "",
      locale: _json.locale ?? "zh-TW",
      picture: _json.picture ?? "",
      provider,
      refreshToken,
    };

    done(null, user);
  }
}
