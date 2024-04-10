import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  @Roles(UserRole.ADMIN)
  async users() {
    return this.userService.findAll();
  }

}
