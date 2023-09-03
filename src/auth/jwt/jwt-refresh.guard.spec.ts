import { type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";
import jestConfig from "src/config/jest.config";

import { JwtRefreshGuard } from "./jwt-refresh.guard";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";

describe("JwtRefreshGuard", () => {
  let jwtRefreshGuard: JwtRefreshGuard;
  let jwtService: JwtService;
  let configService: ConfigService;
  let secret: string | undefined;
  let token: string;

  beforeEach(async () => {
    jest.useFakeTimers();
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jestConfig],
        }),
        PassportModule,
        JwtModule.register({}),
      ],
      providers: [JwtRefreshGuard, JwtRefreshStrategy, JwtService],
    }).compile();

    jwtRefreshGuard = moduleRef.get<JwtRefreshGuard>(JwtRefreshGuard);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    secret = configService.get("jwtSecret.refresh");
    token = jwtService.sign(
      {
        id: 1,
      },
      {
        expiresIn: "7d",
        secret,
      },
    );
  });

  it("should be defined", () => {
    expect(jwtRefreshGuard).toBeDefined();
  });

  describe("valid JWT", () => {
    const response = {};
    const context: ExecutionContext = {
      getRequest: () => ({
        headers: {
          authorization: `bearer ${token}`,
        },
      }),
      getResponse: () => response,
      switchToHttp: () => context,
    } as unknown as ExecutionContext;

    it("should return true for a valid JWT", async () => {
      const canActivate = await jwtRefreshGuard.canActivate(context);

      expect(canActivate).toBe(true);
    });

    it("should throw an error for an expired JWT", async () => {
      jest.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);

      try {
        await jwtRefreshGuard.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    afterEach(async () => {
      jest.clearAllTimers();
    });
  });
});
