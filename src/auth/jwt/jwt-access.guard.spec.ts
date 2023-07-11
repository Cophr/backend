import { type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";
import jestConfig from "src/config/jest.config";
import { jwtAccessConfig } from "src/config/jwt.config";

import { JwtAccessGuard } from "./jwt-access.guard";
import { JwtAccessStrategy } from "./jwt-access.strategy";

describe("JwtAccessGuard", () => {
  let jwtAccessGuard: JwtAccessGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jestConfig],
        }),
        PassportModule,
        JwtModule.registerAsync(jwtAccessConfig),
      ],
      providers: [JwtAccessGuard, JwtAccessStrategy, JwtService],
    }).compile();

    jwtAccessGuard = moduleRef.get<JwtAccessGuard>(JwtAccessGuard);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(jwtAccessGuard).toBeDefined();
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

    const canActivate = await jwtAccessGuard.canActivate(context);

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
      await jwtAccessGuard.canActivate(context);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
