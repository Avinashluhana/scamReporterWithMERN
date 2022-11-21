
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Dependencies } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IAuthUser } from '../interface/user.interface';
import { AppLogger } from 'src/app.logger';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  private authService: AuthService;
  private readonly logger = new AppLogger(LocalStrategy.name);

  constructor(authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
    this.authService = authService;
  }

  async validate(email: string, password: string): Promise<IAuthUser> {
    this.logger.log(`${this.validate.name} was called`);
    const user = await this.authService.validateUser(email, password );
    return { 
      fullName: user.fullName,
      sub: user.id, 
      email: user.email,
      roles: [user.role],
      avatar: user.avatar,
    };
  }
}