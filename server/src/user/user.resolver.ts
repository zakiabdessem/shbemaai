import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.schema';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

}
