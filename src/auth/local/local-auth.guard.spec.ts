import { type ExecutionContext, ForbiddenException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
import { PassportModule } from "@nestjs/passport";
import { Test } from "@nestjs/testing";
import { type LoginUserDto } from "src/user/dto/login-user.dto";

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
            validateUser: jest.fn(),
          },
        },
        LocalStrategy,
      ],
    }).compile();

    localAuthGuard = moduleRef.get<LocalAuthGuard>(LocalAuthGuard);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  function createMockExecutionContext(requestBody: LoginUserDto) {
    const mockResponse = {};

    return {
      switchToHttp: () => ({
        getRequest: () => ({
          body: requestBody,
        }),
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;
  }

  it("should be defined", () => {
    expect(localAuthGuard).toBeDefined();
  });

  it("should return true if user is valid", async () => {
    const mockUser = {
      email: "test@example.com",
      id: 1,
    };

    const mockRequest = {
      account: "test",
      password: "password",
    } as LoginUserDto;

    jest
      .spyOn(authService, "validateUser")
      .mockImplementation(async () => mockUser);

    const result = await localAuthGuard.canActivate(
      createMockExecutionContext(mockRequest),
    );

    expect(result).toBe(true);
  });

  it("should return Forbidden and 403 http code when account information is wrong.", async () => {
    const mockRequest = {
      account: "test",
      password: "password",
    } as LoginUserDto;

    jest
      .spyOn(authService, "validateUser")
      .mockImplementation(async () => null);

    try {
      await localAuthGuard.canActivate(createMockExecutionContext(mockRequest));
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
      expect((error as BadRequestException).getResponse()).toEqual({
        message: ["Account or password is wrong."],
        statusCode: 403,
      });
    }
  });

  it("should return BadRequest and 400 http code when field format validation failed.", async () => {
    const mockRequest = {
      account: "test",
    } as LoginUserDto;

    try {
      await localAuthGuard.canActivate(createMockExecutionContext(mockRequest));
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        error: "Bad Request",
        message: ["password 必須長度大於等於8個字。", "password 為必填欄位。"],
        statusCode: 400,
      });
    }
  });
});
