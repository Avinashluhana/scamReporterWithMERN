import { Body, Controller, HttpCode, Inject, LoggerService, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AppLogger } from "src/app.logger";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/is-public.decorator";
import { ForgetPasswordDto } from "./dtos/forget-password.dto";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {

  private readonly logger = new AppLogger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Public()
  handleLogin(@Request() req) {
    this.logger.log(`${this.handleLogin.name} was called`);
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  handleRegister(@Body() input: RegisterDto) {
    this.logger.log(`${this.handleRegister.name} was called`);
    return this.authService.register(input);
  }

  @Post('forget-password')
  @Public()
  @HttpCode(200)
  handleForgetPassword(@Body() input: ForgetPasswordDto) {
    this.logger.log(`${this.handleForgetPassword.name} was called`);
    return this.authService.forgetPassword(input);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(200)
  handleResetPassword(@Body() input: ResetPasswordDto) {
    this.logger.log(`${this.handleResetPassword.name} was called`);
    return this.authService.resetPassword(input);
  }
}
