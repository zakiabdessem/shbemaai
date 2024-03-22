import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { CartAddDto, Option } from './dtos/cart-add.dto';
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
    try {
      const product = await this.productService.findOne(addCartDto.product);
      if (!product) {
        throw new Error('Product not found');
      }
    
      // Initial check for product option validity
      let productOption;
      if (addCartDto.option) {
        productOption = product.options.find(option => option.name === addCartDto.option);
        if (!productOption) {
          throw new Error('Invalid option');
        }
    
        // Check stock for the specified option
        if (productOption.track && productOption.quantity < addCartDto.quantity) {
          throw new Error('Not enough stock for the selected option');
        } else if (!productOption.track && !productOption.inStock) {
          throw new Error('Selected option is out of stock');
        }
      } else {
        // Check stock for the product itself if no option is specified
        if (product.track && product.quantity < addCartDto.quantity) {
          throw new Error('Not enough stock for the product');
        } else if (!product.track && !product.inStock) {
          throw new Error('Product is out of stock');
        }
      }
    
      if (!session.cart) session.cart = { products: [] };
    
      const existingProductIndex = session.cart.products.findIndex(
        cartProduct => cartProduct.product.toString() === product._id.toString(),
      );
    
      if (existingProductIndex !== -1) {
        // Product exists in the cart
        const existingProduct = session.cart.products[existingProductIndex];
    
        if (addCartDto.option) {
          // Handle option quantity update
          const existingOptionIndex = existingProduct.options?.findIndex(
            opt => opt.name === addCartDto.option,
          );
    
          if (existingOptionIndex >= 0) {
            // Option exists, update its quantity
            existingProduct.options[existingOptionIndex].quantity += addCartDto.quantity;
          } else {
            // New option for the existing product
            existingProduct.options.push({
              name: addCartDto.option,
              quantity: addCartDto.quantity,
            });
          }
        } else {
          // No option specified, update product quantity directly
          existingProduct.quantity += addCartDto.quantity;
        }
      } else {
        // New product, add to cart
        session.cart.products.push({
          product: addCartDto.product,
          options: addCartDto.option ? [{ name: addCartDto.option, quantity: addCartDto.quantity }] : [],
          quantity: addCartDto.option ? 0 : addCartDto.quantity, // Set quantity to 0 if an option is specified, to avoid confusion
        });
      }
    
      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Product added',
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
    
  }
}
