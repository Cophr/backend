import { type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";
import appConfig from "src/config/app.config";
import { jwtConfig } from "src/config/jwt.config";

import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";

describe("LocalAuthGuard", () => {
  let jwtAuthGuard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
        }),
        PassportModule,
        JwtModule.registerAsync(jwtConfig),
      ],
      providers: [JwtAuthGuard, JwtStrategy, JwtService],
    }).compile();

    jwtAuthGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(jwtAuthGuard).toBeDefined();
  });

  it("should return true for a valid JWT", async () => {
    const payload = { email: "testuser", id: 1 };
    const token = jwtService.sign(payload);

    const respoese = {};
    const context: ExecutionContext = {
      getRequest: () => ({
        headers: {
          authorization: `bearer ${token}`,
        },
      }),
      getResponse: () => respoese,
      switchToHttp: () => context,
    } as unknown as ExecutionContext;

    const canActivate = await jwtAuthGuard.canActivate(context);

    expect(canActivate).toBe(true);
  });

  it("should throw an error for an expired JWT", async () => {
    const payload = { email: "testuser", id: 1 };
    const token = jwtService.sign(payload, { expiresIn: 0 });

    const respoese = {};
    const context: ExecutionContext = {
      getRequest: () => ({
        headers: {
          authorization: `bearer ${token}`,
        },
      }),
      getResponse: () => respoese,
      switchToHttp: () => context,
    } as unknown as ExecutionContext;

    try {
      await jwtAuthGuard.canActivate(context);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
