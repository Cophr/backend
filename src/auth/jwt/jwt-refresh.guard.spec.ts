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
  });

  it("should be defined", () => {
    expect(jwtRefreshGuard).toBeDefined();
  });

  it("should return true for a valid JWT", async () => {
    const payload = { id: 1 };
    const secret: string | undefined = configService.get("jwtSecret.refresh");
    const token = jwtService.sign(payload, {
      expiresIn: "7d",
      secret,
    });

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

    const canActivate = await jwtRefreshGuard.canActivate(context);

    expect(canActivate).toBe(true);
  });

  it("should throw an error for an expired JWT", async () => {
    const secret: string | undefined = configService.get("jwtSecret.refresh");
    const token = jwtService.sign(
      {
        id: 1,
      },
      {
        expiresIn: "7d",
        secret,
      },
    );

    jest.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);

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
