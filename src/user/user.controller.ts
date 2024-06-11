import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Req,
  Get,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UserCreateDto } from './dtos/user-create.dto';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import cookieConfig from '../config/cookie';
import { UserService } from './user.service';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';

@Controller('user')
export class UserController {
  // private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.SUPER)
  @Post('register')
  register(@Body() createUserDto: UserCreateDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('whitelist')
  async registerPendings(
    @Body() createUserDto: UserCreateDto,
    @Res() res: Response,
  ) {
    try {
      await this.userService.createUserPending(createUserDto);

      return res.status(HttpStatus.OK).json({
        message:
          'Vous avez enregistré avec succès, attendez que nous vous contacter.',
      });
    } catch (error) {
      //console.log(error);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authentication failed',
      });
    }
  }

  @Post('register/client')
  async registerClient(
    @Body() createUserDto: UserCreateDto,
    @Res() res: Response,
  ) {
    try {
      await this.userService.createUser(createUserDto);

      return res.status(HttpStatus.OK).json({
        message: 'Vous avez enregistré avec succès.',
      });
    } catch (error) {
      //console.log(error);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authentication failed',
      });
    }
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
      delete user.password;

      return res
        .cookie('jwt', token, cookieConfig())
        .status(HttpStatus.OK)
        .json({ message: 'Auth Success', token, user });
    } catch (error) {
      Logger.error(error);
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

      const user = await this.userService.findOneById(decoded._id);
      if (!user) return res.status(404).json({ auth: false });

      delete user.password;

      return res.status(HttpStatus.OK).json({ message: 'Auth Success', user });
    } catch (error) {
      Logger.error(error);
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
