import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/decorator/role.entity';
import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';
import { IRequest } from 'src/interface';

@Injectable()
export class GQLRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) return true;

      const gqlContext = GqlExecutionContext.create(context).getContext();
      const req = gqlContext.req;

      const token = req.cookies.jwt;

      const user = verify(token, process.env.SECRET);

      if (!user || !user.role)
        throw new UnauthorizedException('No roles found for the user.');

      if (user.role === UserRole.SUPER) return true;

      const hasRole = requiredRoles.includes(user.role);
      if (!hasRole)
        throw new UnauthorizedException(
          'User does not have the required roles.',
        );

      return true;
    } catch (error) {
      return false;
    }
  }
}
