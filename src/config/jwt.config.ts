import { ConfigModule, ConfigService } from "@nestjs/config";
import { type JwtModuleAsyncOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get("appSecret"),
    signOptions: { expiresIn: "1d" },
  }),
};
