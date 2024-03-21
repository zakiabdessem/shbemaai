import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { CartAddDto } from './dtos/cart-add.dto';
import { Response } from 'express';
import { CouponService } from 'src/coupon/coupon.service';
import { ProductService } from 'src/product/product.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly couponService: CouponService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async get(@Session() session: Record<string, any>, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({
        cart: session.cart || {},
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('add/coupon')
  async addCoupon(
    @Session() session: Record<string, any>,
    @Body() code: string,
    @Res() res: Response,
  ) {
    try {
      const coupon = await this.couponService.findOne(code);
      if (!coupon) throw new Error('Coupon not found');

      session.cart = {
        ...session.cart,
        coupon: coupon._id,
      };

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Coupon added',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('add/product')
  async add(
    @Session() session: Record<string, any>,
    @Body() addCartDto: CartAddDto,
    @Res() res: Response,
  ) {
    // try {
    //   const product = await this.productService.findOne(addCartDto.product);
    //   if (!product) throw new Error('Product not found');

    //   if (
    //     addCartDto.option &&
    //     !product.options.some((option) => option.name === addCartDto.option)
    //   ) {
    //     throw new Error('Invalid options');
    //   }

    //   if (!product.track && !product.inStock) {
    //     throw new Error('Out of stock');
    //   }

    //   if (product.track && product.quantity < addCartDto.quantity) {
    //     throw new Error('Not enough stock');
    //   }

    //   if (!session.cart) session.cart = { products: [] };

    //   const existingProductIndex = session.cart.products.findIndex(
    //     (p) => p.product == product._id,
    //   );

    //   if (existingProductIndex !== -1) {
    //     // Update quantity if product exists
    //     session.cart.products[existingProductIndex].quantity +=
    //       addCartDto.quantity;
    //   } else {
    //     // Add new product if it doesn't exist
    //     session.cart.products.push({
    //       product: product._id,
    //       quantity: addCartDto.quantity,
    //       option: addCartDto.option,
    //     });
    //   }

    //   return res.status(HttpStatus.ACCEPTED).json({
    //     message: 'Product added',
    //   });
    // } catch (error) {
    //   return res
    //     .status(HttpStatus.BAD_REQUEST)
    //     .json({ message: error.message });
    // } //TODO: Wslt win lazem option of product have quantity
  }
}
