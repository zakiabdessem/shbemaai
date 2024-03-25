import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/decorator/role.entity';
import { ROLES_KEY } from 'src/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.decodedToken;

    if (!user || !user.role)
      throw new UnauthorizedException('No roles found for the user.');

    if (user.role === UserRole.SUPER) return true;
    
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole)
      throw new UnauthorizedException('User does not have the required roles.');

    return true;
  }
}
