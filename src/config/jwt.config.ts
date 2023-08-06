import { ConfigModule, ConfigService } from "@nestjs/config";
import { type JwtModuleAsyncOptions } from "@nestjs/jwt";

export const jwtAccessConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get("jwtSecret.access"),
    signOptions: { expiresIn: "1d" },
  }),
};
