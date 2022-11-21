import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { AppLogger } from "src/app.logger";
import { EmailService } from "src/shared/email.service";
import { HelperService } from "src/shared/helper.service";
import { Role } from "src/user/constants";
import { UserOutDto } from "src/user/dtos/user-out.dto";
import { User, UserDocument } from "src/user/user.model";
import { ForgetPasswordDto } from "./dtos/forget-password.dto";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { IAuthUser } from "./interface/user.interface";
import { JsonWebTokenError } from 'jsonwebtoken';
import { Template } from "src/shared/constants";

@Injectable()
export class AuthService {

  private readonly logger = new AppLogger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private emailService: EmailService,
    private jwtService: JwtService,
    private helperService: HelperService,
    private configService: ConfigService,
  ) { }

  async register(input: RegisterDto) {
    const userExists = await this.userModel.findOne({ email: input.email });
    if (userExists) throw new BadRequestException('User already registered against provided email.');

    // set role property
    Object.assign(input, { role: Role.User });

    // hash password before storing in db
    input.password = await this.helperService.generateHash(input.password);

    const user = new this.userModel(input);
    await user.save();
    return { message: 'Successfully Registered' };
  }

  async validateUser(email: string, pw: string): Promise<UserOutDto> {
    this.logger.log(`${this.validateUser.name} was called`);
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new BadRequestException('Invalid email or password');

    const isPasswordValid = await this.helperService.compareHash(pw, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid email or password');

    if (!user.active) throw new BadRequestException('User Inactive. Please contact system admin');

    return plainToInstance(UserOutDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async forgetPassword(input: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email: input.email });
    if (user) {

      // generate reset password token
      const token = this.jwtService.sign({ sub: user.email, type: 'reset-password-token' }, { expiresIn: '10m' });
      const feDomain = this.configService.get<string>('url.fe');
      const data = {
        resetLink: `${feDomain}/user/reset-password?token=${token}`
      };

      try {
        await this.emailService.sendEmail(user.email, 'Reset Password', Template.RESET_PASSWORD, data);

      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }

    }

    return { message: 'Reset password email sent successfully. Please check your email' };
  }

  async resetPassword(input: ResetPasswordDto) {
    try {

      const payload = this.jwtService.verify<{ sub: string, type: string }>(input.token);
      if (payload && payload.type != 'reset-password-token') throw new BadRequestException('invalid token type');

      input.password = await this.helperService.generateHash(input.password);

      const user = await this.userModel.findOne({ email: payload.sub });
      if (!user) throw new NotFoundException('user not found');

      // set new password
      user.password = input.password;

      await user.save();

      return { message: 'Password Reset Successful' };
    } catch (error) {
      if (error instanceof JsonWebTokenError) throw new BadRequestException(error.message);
      throw error;
    }
  }

  async login(user: IAuthUser) {
    return { access_token: this.jwtService.sign(user) };
  }

}