import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserCreateDto } from './dtos/user-create.dto';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import cookieConfig from '../config/cookie';
import { UserService } from './user.service';
import { OAuth2Client } from 'google-auth-library';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { RolesGuard } from 'src/guard/role.guard';

@Controller('user')
export class UserController {
  // private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER)
  @Post('register')
  register(@Body() createUserDto: UserCreateDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.loginUser(email, password);

      if (!user)
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });

      const token = await sign(user, process.env.SECRET);

      return res
        .cookie('jwt', token, cookieConfig())
        .status(HttpStatus.OK)
        .json({ message: 'Auth Success', token });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authentication failed',
      });
    }
  }

  @Get('verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    try {
      const decoded = req.decodedToken;

      const User = await this.userService.findOneById(decoded._id);
      if (!User) return res.status(404).json({ auth: false });

      return res.status(HttpStatus.OK).json({ message: 'Auth Success' });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authentication failed',
      });
    }
  }

  // @Post('auth/google')
  // async googleAuth(
  //   @Body() { token }: { token: string },
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const ticket = await this.client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //     });
  //     const payload = ticket.getPayload();

  //     if (!payload?.email_verified) throw new Error('Email not verified');

  //     const user = await this.userService.findOneByEmail(payload.email);

  //     if (!user)
  //       return res
  //         .status(HttpStatus.UNAUTHORIZED)
  //         .json({ message: 'Invalid credentials' });

  //     const tokenCookie = await sign(user._id.toString(), process.env.SECRET);

  //     return res
  //       .cookie('jwt', tokenCookie, cookieConfig())
  //       .status(HttpStatus.OK)
  //       .json({ message: 'Auth Success' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(HttpStatus.UNAUTHORIZED).json({
  //       statusCode: HttpStatus.UNAUTHORIZED,
  //       message: 'Authentication failed',
  //     });
  //   }
  // } 
}
