import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppLogger } from 'src/app.logger';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { Role } from 'src/user/constants';
import { IAuthUser } from '../interface/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {

  private readonly logger = new AppLogger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.log(`${this.canActivate.name} was executed`);
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    
    const request = context.switchToHttp().getRequest();
    const user: IAuthUser = request.user;

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}