import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  Session,
  forwardRef,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  OrderCreateDtoBussiness,
  OrderCreateDtoClient,
} from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { ClientService } from 'src/client/client.service';
import { ChargilyService } from 'src/chargily/charigly.service';
import { fetchCommunDTO } from './dtos/fetch-commoun.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { ProductService } from 'src/product/product.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => ChargilyService))
    readonly chargilyService: ChargilyService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post('single')
  async order(@Body() { id }: { id: string }, @Res() res: Response) {
    try {
      const order = await this.orderService.findOne(id);

      let productPromises;
      if (order.cart.products?.length > 0) {
        productPromises = order.cart.products.map((item) =>
          this.productService.findOne(item.product),
        );
      }

      return res.status(HttpStatus.OK).json({
        order,
        productsData: productPromises ? await Promise.all(productPromises) : [],
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Une erreur est apparue.',
      });
    }
  }

  @Roles(UserRole.ADMIN)
  @Post('update')
  async update(
    @Body() { id, status }: { id: string; status: string },
    @Res() res: Response,
  ) {
    try {
      const order = await this.orderService.updateStatusById(id, status);

      return res.status(HttpStatus.OK).json({
        message: 'Success',
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Une erreur est apparue.',
      });
    }
  }

  @Post('client/create')
  async create(
    @Session() session: Record<string, any>,
    @Body() orderCreateDto: OrderCreateDtoClient,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!session.cart || session.cart?.products?.length < 1) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Cart is empty',
      });
    }

    try {
      //! Already created order
      // if (session.cart?.order) {
      //   const order = await this.orderService.findOne(session.cart.order);

      // if (this.orderService.checkIfOrderExpired(order.createdAt))
      //   return res.status(HttpStatus.BAD_REQUEST).json({
      //     message: 'Order already created',
      //   });
      // }

      //! Check willaya and address yalidine user
      const createdOrder = await this.orderService.createClient(
        orderCreateDto,
        session.cart,
      );

      session.cart.order = createdOrder._id.toString();

      let url;
      if (orderCreateDto.paymentType == 'cib') {
        //TODO: create paiment here
        // const { id: clientId } = await this.chargilyService.createClient(
        //   orderCreateDto.client as Client,
        // ); IDK if you need this

        const { id: productId } = await this.chargilyService.createProduct(
          session.cart,
        );

        const { id: priceId } = await this.chargilyService.createPrice(
          productId,
          session.cart.totalPrice,
        );

        const { checkout_url, id } = await this.chargilyService.createCheckout(
          priceId,
          createdOrder._id,
        );

        await this.orderService.pushCheckoutId(createdOrder._id.toString(), id);

        url = checkout_url;
      }

      session.cart = {};

      return res.status(HttpStatus.CREATED).json({
        message: 'Order created successfully',
        ...(orderCreateDto.paymentType == 'cib' && {
          url: Object.values(url).join(''),
        }),
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:
          'Une erreur est apparue, veuillez changer le mode de paiement pour Cash.',
      });
    }
  }

  @Post('client/bussiness')
  async createBussiness(
    @Session() session: Record<string, any>,
    @Body() orderCreateDto: OrderCreateDtoBussiness,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      //! Check willaya and address yalidine user
      const createdOrder = await this.orderService.createBussiness(
        orderCreateDto
      );

      return res.status(HttpStatus.CREATED).json({
        message: 'Order created successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:
          'Une erreur est apparue, veuillez changer le mode de paiement pour Cash.',
      });
    }
  }

  @Get('count')
  async countDocument() {
    return await this.orderService.countDocument();
  }

  @Roles(UserRole.ADMIN)
  @Get('wilayas')
  async wilayas() {
    return await this.chargilyService.fetchWilayas();
  }

  @Post('communes')
  async communes(
    @Body() { willayaID, stopDesk }: fetchCommunDTO,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.CREATED).json({
        communs: await this.chargilyService.fetchCommunes({
          willayaID,
          stopDesk,
        }),
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:
          'Une erreur est apparue, veuillez changer le mode de paiement pour Cash.',
      });
    }
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
