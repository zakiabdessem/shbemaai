import { Controller, Get, HttpStatus, Logger, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('address')
  async address(@Req() req: Request, @Res() res: Response) {
    try {
      const decoded = req.decodedToken;

      const client = await this.clientService.findOneByEmail(decoded.email);
      if (!client) return res.status(404).json({ auth: false });

      return res.status(HttpStatus.OK).json({ client });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authentication failed',
      });
    }
  }
}
