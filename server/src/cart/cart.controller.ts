import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import {
  CartAddCouponDto,
  CartAddDto,
  CartDeleteDto,
  addCartNoteDto,
} from './dtos/cart-add.dto';
import { Response } from 'express';
import { CouponService } from 'src/coupon/coupon.service';
import { ProductService } from 'src/product/product.service';
import { Cart } from './types/types';

@Controller('cart')
export class CartController {
  constructor(
    private readonly couponService: CouponService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async get(@Session() session: Record<string, any>, @Res() res: Response) {
    try {
      let productPromises;
      if (session.cart?.products?.length > 0) {
        productPromises = session.cart.products.map((item) =>
          this.productService.findOne(item.product),
        );
      }

      return res.status(HttpStatus.OK).json({
        cart: {
          ...session.cart,
          productsData: productPromises
            ? await Promise.all(productPromises)
            : [],
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('count') async getCount(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json(session.cart?.products?.length || 0);
  }

  @Post('add/coupon')
  async addCoupon(
    @Session() session: Record<string, any>,
    @Body() addCouponDto: CartAddCouponDto,
    @Res() res: Response,
  ) {
    try {
      if (!addCouponDto.code || addCouponDto.code === '')
        throw new Error('Le code promo est requis');

      const coupon = await this.couponService.findOne(
        addCouponDto.code,
      );
      if (!coupon)
        throw new Error('Coupon introuvable ou pas actif');

      if (session.cart?.coupon == coupon._id) {
        throw new Error('Un coupon est déjà appliqué');
      }

      //coupon expiration data check
      if (
        coupon.expireDate &&
        new Date(coupon.expireDate.toString()) < new Date()
      ) {
        throw new Error('Coupon expiré');
      }

      session.cart = {
        ...session.cart,
        coupon: coupon._id,
      };

      if (session.cart.products.length > 0)
        Object.assign(
          session.cart,
          await this.calculateTotalCart(session.cart),
        );

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Coupon added',
        discountedPrice: session.cart.discountedPrice,
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

      if (!product.show) {
        throw new Error('Product not for sale');
      }

      // Initial check for product option validity
      let productOption;
      if (addCartDto.option) {
        productOption = product.options.find(
          (option) => option.name === addCartDto.option,
        );
        if (!productOption) {
          throw new Error('Invalid option');
        }

        // Check stock for the specified option
        if (
          productOption.track &&
          productOption.quantity < addCartDto.quantity
        ) {
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

      if (!session.cart?.products) session.cart = { products: [] };

      const existingProductIndex = session.cart.products.findIndex(
        (cartProduct) =>
          cartProduct.product.toString() === product._id.toString(),
      );

      if (existingProductIndex !== -1) {
        // Product exists in the cart
        const existingProduct = session.cart.products[existingProductIndex];

        if (addCartDto.option) {
          // Handle option quantity update
          const existingOptionIndex = existingProduct.options?.findIndex(
            (opt) => opt.name === addCartDto.option,
          );

          if (existingOptionIndex >= 0) {
            // Option exists, update its quantity
            existingProduct.options[existingOptionIndex].quantity +=
              addCartDto.quantity;
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
          options: addCartDto.option
            ? [{ name: addCartDto.option, quantity: addCartDto.quantity }]
            : [],
          quantity: addCartDto.option ? 0 : addCartDto.quantity, // Set quantity to 0 if an option is specified, to avoid confusion
        });
      }

      Object.assign(session.cart, await this.calculateTotalCart(session.cart));

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Product added',
      });
    } catch (error) {
      Logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('remove/product')
  async remove(
    @Session() session: Record<string, any>,
    @Body() addCartDto: CartDeleteDto,
    @Res() res: Response,
  ) {
    try {
      if (!session.cart?.products) {
        throw new Error('Cart is empty');
      }

      const product = await this.productService.findOne(addCartDto.product);
      if (!product) {
        throw new Error('Product not found');
      }

      const existingProductIndex = session.cart.products.findIndex(
        (cartProduct) =>
          cartProduct.product.toString() === product._id.toString(),
      );

      if (existingProductIndex === -1) {
        throw new Error('Product not found in the cart');
      }

      const existingProduct = session.cart.products[existingProductIndex];

      if (addCartDto.option) {
        const existingOptionIndex = existingProduct.options?.findIndex(
          (opt) => opt.name === addCartDto.option,
        );

        if (existingOptionIndex >= 0) {
          // Option exists, remove it
          if (
            addCartDto.quantity &&
            existingProduct.options[existingOptionIndex].quantity > 1
          ) {
            existingProduct.options[existingOptionIndex].quantity -=
              addCartDto.quantity;
          } else {
            existingProduct.options.splice(existingOptionIndex, 1);
            if (
              existingProduct.options.length == 0 &&
              existingProduct.quantity == 0
            )
              session.cart.products.splice(existingProductIndex, 1);
          }
        } else {
          throw new Error('Option not found');
        }
      } else {
        // No option specified, remove the product
        if (addCartDto.quantity && existingProduct.quantity > 1) {
          existingProduct.quantity -= addCartDto.quantity;
        } else {
          session.cart.products.splice(existingProductIndex, 1);
        }
      }

      Object.assign(session.cart, await this.calculateTotalCart(session.cart));

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Product removed',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete('clear')
  async clear(@Session() session: Record<string, any>, @Res() res: Response) {
    try {
      session.cart.products = [];

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Cart cleared',
      });
    } catch (error) {
      Logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete('remove/coupon')
  async removeCoupon(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      if (!session.cart?.coupon) {
        throw new Error('No coupon applied');
      }

      session.cart.coupon = null;

      Object.assign(session.cart, await this.calculateTotalCart(session.cart));

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Coupon removed',
      });
    } catch (error) {
      Logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('add/note')
  async addNote(
    @Session() session: Record<string, any>,
    @Body() addNoteDto: addCartNoteDto,
    @Res() res: Response,
  ) {
    try {
      if (!addNoteDto.note || addNoteDto.note === '') {
        throw new Error('Note is required');
      }

      if (!session.cart) session.cart = { note: '' };

      session.cart.note = addNoteDto.note;

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Note added',
      });
    } catch (error) {
      Logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete('remove/note')
  async removeNote(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      if (!session.cart?.note) {
        throw new Error('No note added');
      }

      session.cart.note = null;

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Note removed',
      });
    } catch (error) {
      Logger.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  private async calculateTotalCart(cart: Cart) {
    let totalPrice = 0;

    const productsPromises = cart.products.map((item) => {
      if (item) {
        return this.productService.findOne(item.product).then((product) => {
          const productBasePrice = product.price;

          const defaultProductTotalPrice = productBasePrice * item.quantity;

          if (!item.options) return defaultProductTotalPrice;

          let optionsPrice = 0;
          item.options.forEach((option) => {
            const optionIndex = product.options.findIndex(
              (opt) => opt.name === option.name,
            );
            optionsPrice +=
              product.options[optionIndex].price * option.quantity;
          });

          return optionsPrice + defaultProductTotalPrice;
        });
      }
    });

    await Promise.all(productsPromises).then((prices) => {
      prices.forEach((price) => {
        totalPrice += price;
      });
    });

    // Apply coupon if available
    const subTotal = totalPrice;
    let discountedPrice = 0;
    let discountPercentage = 0;

    if (cart.coupon) {
      const coupon = await this.couponService.findOneById(
        cart.coupon.toString(),
      );
      if (coupon) {
        discountPercentage = coupon.discount;
        discountedPrice = (totalPrice * coupon.discount) / 100;
        totalPrice -= (totalPrice * coupon.discount) / 100;
      }
    }

    return {
      subTotal,
      totalPrice,
      discountedPrice,
      discountPercentage,
    };
  }
}
