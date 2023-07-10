import { type ExecutionContext, ForbiddenException } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";

import { AuthService } from "../auth.service";
import { LocalStrategy } from "./local.strategy";
import { LocalAuthGuard } from "./local-auth.guard";

describe("LocalAuthGuard", () => {
  let localAuthGuard: LocalAuthGuard;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [
        LocalAuthGuard,
        {
          provide: AuthService,
          useValue: {
            // 模拟AuthService中的方法
            validateUser: jest.fn(),
          },
        },
        LocalStrategy,
      ],
    }).compile();

    localAuthGuard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(localAuthGuard).toBeDefined();
  });

  it("should return true if user is valid", async () => {
    const mockUser = {
      email: "test@example.com",
      id: 1,
    };

    const mockRequest = {
      body: {
        account: "test",
        password: "password",
      },
    };

    const mockResponse = {};

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    jest
      .spyOn(authService, "validateUser")
      .mockImplementation(async () => mockUser);

    const result = await localAuthGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it("should return false if user is invalid", async () => {
    const mockResponse = {};
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          body: {
            account: "test",
            password: "password",
          },
        }),
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    jest
      .spyOn(authService, "validateUser")
      .mockImplementation(async () => null);

    try {
      await localAuthGuard.canActivate(mockExecutionContext);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.getResponse()).toEqual({
          message: ["Account or password is wrong."],
          statusCode: 403,
        });
      }
    }
  });
});
