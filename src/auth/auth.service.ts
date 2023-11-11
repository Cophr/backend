import { ConflictException, HttpStatus, Injectable } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import type { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

import { AuthProviders } from "./entities/auth.provider.entity";
import { OauthIntegration } from "./entities/oauth.integrations.entity";
import { type GoogleProfile } from "./google/google.profile";
import { type JwtUser } from "./jwt/jwt.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthProviders)
    private readonly providerRepository: Repository<AuthProviders>,
    @InjectRepository(OauthIntegration)
    private readonly oauthRepository: Repository<OauthIntegration>,
  ) {}

  async register(userDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userDto.email }, { account: userDto.account }],
    });

    if (existingUser) {
      const keys = ["email", "account"];
      const conflictedAttributes: string[] = [];

      keys.forEach(key => {
        if (existingUser[key] === userDto[key]) {
          conflictedAttributes.push(`${key} 已被註冊。`);
        }
      });

      throw new ConflictException(conflictedAttributes);
    }

    return this.userService.create(userDto);
  }

  async sign(user: JwtUser) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      statusCode: HttpStatus.CREATED,
    };
  }

  async validateUser(username: string, password: string) {
    const user: UserEntity | null = await this.userService.findOne(username);

    if (!user) return null;

    const passwordCorrect = bcrypt.compareSync(password, user.password);
    const userData = { id: user.id };

    if (!passwordCorrect) {
      return null;
    }

    return userData;
  }

  async generateAccessToken(user: JwtUser): Promise<string> {
    const payload: JwtUser = {
      id: user.id,
    };
    const secret: string | undefined =
      this.configService.get("jwtSecret.access");
    const token = this.jwtService.sign(payload, {
      expiresIn: "1h",
      secret,
    });

    return token;
  }

  async generateRefreshToken(user: JwtUser): Promise<string> {
    const payload: JwtUser = {
      id: user.id,
    };
    const secret: string | undefined =
      this.configService.get("jwtSecret.refresh");
    const token = this.jwtService.sign(payload, {
      expiresIn: "7d",
      secret,
    });

    return token;
  }

  /**
   * Verify user data and return the token.
   */
  async googleLogin(userData: GoogleProfile) {
    let userExists = await this.userService.findOne(userData.email);
    const oauthUserExists = await this.findAuthIntegrations(
      userData.externalId,
    );

    let userId = 0;

    /*
     * Confirm that the user has previously registered
     * locally or through Google.
     */
    if (
      userExists &&
      oauthUserExists &&
      oauthUserExists.user.id === userExists.id
    ) {
      userId = userExists.id;
    } else {
      /*
       * User does not exist, therefore create user data.
       * If the user exists, establish a connection with the local data.
       */
      if (!userExists) {
        userExists = await this.userService.createByGoogle(userData);
      }

      await this.createOauthIntegrations(
        userData,
        userExists,
        await this.findAuthProvider("google"),
      );

      userId = userExists.id;
    }

    return this.sign({ id: userId });
  }

  async createOauthIntegrations(
    userData: GoogleProfile,
    user: UserEntity,
    authProvider: AuthProviders,
  ) {
    const googleData = this.oauthRepository.create({
      accessToken: userData.accessToken,
      authProvider,
      externalId: userData.externalId,
      refreshToken: userData.refreshToken,
      user,
    });

    await this.oauthRepository.save(googleData);
  }

  async findAuthIntegrations(
    externalId: string,
  ): Promise<OauthIntegration | null> {
    const authIntegrations = await this.oauthRepository.findOne({
      relations: {
        user: true,
      },
      select: {
        accessToken: true,
        id: true,
        refreshToken: true,
        user: {
          id: true,
        },
      },
      where: {
        externalId,
      },
    });

    if (!authIntegrations) {
      return null;
    }

    return authIntegrations;
  }

  async findAuthProvider(title: string): Promise<AuthProviders> {
    const provider = await this.providerRepository.findOneBy({
      title,
    });

    if (!provider) {
      throw new BadRequestException({
        message: ["This login method does not exist."],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return provider;
  }
}
