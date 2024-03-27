import { Injectable } from '@nestjs/common';
import { ChargilyClient } from '@chargily/chargily-pay';
import { Client } from 'src/client/client.schema';
import { Cart } from 'src/order/order.schema';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/product.schema';

const client = new ChargilyClient({
  api_key: 'test_sk_mGOddXvxB5QN4Qb4bWSkJ7QjmIVmYp61aq2NQIoj', //TODO: TO .ENV
  mode: 'test',
});

@Injectable()
export class ChargilyService {
  constructor(private readonly productService: ProductService) {}

  async createClient(clientDto: Client) {
    const customerData = {
      name: clientDto.firstName + ' ' + clientDto.lastName,
      email: clientDto.email,
      phone: clientDto.address.phone,
      address: {
        country: 'DZ',
        state: clientDto.address.state,
        address: clientDto.address.address,
      },
      metadata: {
        notes: 'Note Included in the admin dashboard',
      },
    };

    return await client.createCustomer(customerData);
  }

  async createProduct(cart: Cart) {
    const product = await this.productService.findOne(cart.products[0].product);

    return await client.createProduct({
      name: product.name,
      description: product.description ?? 'No Descp',
      metadata: {
        category: 'Library items',
      },
    });
  }

  async createPrice(product_id: string, amount) {
    return await client.createPrice({
      amount,
      currency: 'dzd',
      product_id,
    });
  }

  async createCheckout(priceId: string, order_id: string) {
    return await client.createCheckout({
      items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url:
        'https://github.com/Chargily/chargily-pay-javascript/issues/',
      failure_url:
        'https://github.com/Chargily/chargily-pay-javascript/issues/5',
    });
  }
}
