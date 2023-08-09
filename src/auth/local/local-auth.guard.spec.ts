import {
  type ExecutionContext,
  ForbiddenException,
  HttpException,
} from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
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

  it("should return Forbidden and 403 http code when account information is wrong.", async () => {
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
      if (error instanceof HttpException) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.getResponse()).toEqual({
          message: ["Account or password is wrong."],
          statusCode: 403,
        });
      }
    }
  });

  it("should return BadRequest and 400 http code when field format validation failed.", async () => {
    const mockResponse = {};
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          body: {
            account: "test",
          },
        }),
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    try {
      await localAuthGuard.canActivate(mockExecutionContext);
    } catch (error) {
      if (error instanceof HttpException) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: "Bad Request",
          message: [
            "password 必須長度大於等於8個字。",
            "password 為必填欄位。",
          ],
          statusCode: 400,
        });
      }
    }
  });
});
