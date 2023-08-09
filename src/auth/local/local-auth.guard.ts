import {
  type ArgumentMetadata,
  type BadRequestException,
  type ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { validationPipe } from "src/pipes/validation-pipe";
import { LoginUserDto } from "src/user/dto/login-user.dto";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const loginDto = plainToClass(LoginUserDto, request.body);

    const metadata: ArgumentMetadata = {
      data: "@Body()",
      metatype: LoginUserDto,
      type: "body",
    };

    await validationPipe
      .transform(loginDto, metadata)
      .catch((error: BadRequestException) => {
        throw error;
      });

    return super.canActivate(context) as Promise<boolean> | boolean;
  }
}
