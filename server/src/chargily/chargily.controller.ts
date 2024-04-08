import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  Res,
  forwardRef,
} from '@nestjs/common';
import { ChargilyService } from './charigly.service';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { OrderService } from 'src/order/order.service';

@Controller('chargily')
export class ChargilyController {
  constructor(
    readonly chargilyService: ChargilyService,
    @Inject(forwardRef(() => OrderService))
    readonly orderService: OrderService,
  ) {}

  @Post('webhook')
  async webhookChargily(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const body = req.body;
      const rawBody = req.rawBody;

      const signature = req.get('signature');

      if (!signature) {
        return res.status(HttpStatus.BAD_REQUEST);
      }

      if (!rawBody) {
        return res.status(HttpStatus.BAD_REQUEST);
      }

      const computedSignature = crypto
        .createHmac('sha256', process.env.CHARGILY_API)
        .update(rawBody)
        .digest('hex');

      if (computedSignature !== signature) {
        return res.status(HttpStatus.FORBIDDEN);
      }

      switch (body.type) {
        case 'checkout.paid':
          const checkout = body.data;
          await this.orderService.updateStatusByCheckoutId(checkout.id, 'confirmed');
          break;
        case 'checkout.failed':
          const failedCheckout = body.data;
          await this.orderService.updateStatusByCheckoutId(failedCheckout.id, 'canceled');
          break;
      }

      return res.status(HttpStatus.OK);
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
