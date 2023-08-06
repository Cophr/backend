import { ForbiddenException } from "@nestjs/common";
import { type TestingModule, Test } from "@nestjs/testing";

import { AuthService } from "../auth.service";
import { LocalStrategy } from "./local.strategy";

describe("LocalStrategy", () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
        LocalStrategy,
      ],
    }).compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(localStrategy).toBeDefined();
  });

  it("should return user payload if user is valid", async () => {
    const mockAccount = "test";
    const mockPassword = "password";

    const mockUser = {
      id: 1,
    };

    jest
      .spyOn(authService, "validateUser")
      .mockImplementation(async () => mockUser);

    const result = await localStrategy.validate(mockAccount, mockPassword);

    expect(result).toEqual({
      id: mockUser.id,
    });
  });

  it("should throw ForbiddenException if user is invalid", async () => {
    const mockAccount = "test";
    const mockPassword = "password";

    jest
      .spyOn(authService, "validateUser")
      .mockImplementation(async () => null);

    try {
      await localStrategy.validate(mockAccount, mockPassword);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });
});
