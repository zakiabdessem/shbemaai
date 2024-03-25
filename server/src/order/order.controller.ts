import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { Request, Response } from 'express';
import {
  OrderCreateDtoBussiness,
  OrderCreateDtoClient,
} from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { ClientService } from 'src/client/client.service';
import { Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
  ) {}

  @Post('client/create')
  async create(
    @Session() session: Record<string, any>,
    @Body() orderCreateDto: OrderCreateDtoClient,
    @Res() res: Response,
  ) {
    try {
      if (!session.cart || session.cart?.products?.length < 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Cart is empty',
        });
      }

      //! Already created order
      if (session.cart?.order) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Order already created',
        });
      }

      //! Check willaya and address yalidine user
      const createdOrder = await this.orderService.createClient(
        orderCreateDto,
        session.cart,
      );

      session.cart.order = createdOrder._id.toString();

      return res.status(HttpStatus.CREATED).json({
        message: 'Order created successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Get('count')
  async countDocument() {
    return await this.orderService.countDocument();
  }


  // @Roles(UserRole.BUISNESS, UserRole.ADMIN)
  // @Post('business/create')
  // async createBussines(
  //   @Body() orderCreateDto: OrderCreateDtoBussiness,
  //   @Session() session: Record<string, any>,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   // TODO: CART FOR BUSSINES
  //   //! Include User id in the client nad push order to the user
  //   try {
  //     if (session.cart?.products?.length < 1) {
  //       return res.status(HttpStatus.BAD_REQUEST).json({
  //         message: 'Cart is empty',
  //       });
  //     }

  //     console.log('req.decodedToken', req.decodedToken);
  //     await this.orderService.createClient({
  //       client: await this.clientService.create(orderCreateDto.client),
  //       paymentType: orderCreateDto.paymentType,
  //       ...session.cart,
  //     });

  //     // await this.orderService.createBussiness(orderCreateDto);
  //     return res.status(HttpStatus.CREATED).json({
  //       message: 'Order created successfully',
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       message: error.message,
  //     });
  //   }
  // }
}
