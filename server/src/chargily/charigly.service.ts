import { Injectable } from '@nestjs/common';
import { ChargilyClient } from '@chargily/chargily-pay';
import { Client } from 'src/client/client.schema';
import { Cart } from 'src/order/order.schema';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/product.schema';
import axios from 'axios';

const client = new ChargilyClient({
  api_key: 'test_sk_mGOddXvxB5QN4Qb4bWSkJ7QjmIVmYp61aq2NQIoj',
  mode: 'test',
});

@Injectable()
export class ChargilyService {
  constructor(private readonly productService: ProductService) {}

  async client() {
    return client;
  }

  async createClient(clientDto: Client) {
    const customerData = {
      name: clientDto.firstName + ' ' + clientDto.lastName,
      email: clientDto.email,
      phone: clientDto.address.phone,
      address: {
        country: 'DZ',
        state: clientDto.address.commun,
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
    const checkout = await client.createCheckout({
      items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://www.chebaani.com/success',
      failure_url: 'https://www.chebaani.com/',
    });
    return checkout;
  }

  async fetchWilayas() {
    const url = 'https://api.yalidine.app/v1/wilayas/';

    const headers = {
      'X-API-ID': process.env.YALIDINE_API_ID,
      'X-API-TOKEN': process.env.YALIDINE_API_TOKEN,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(url, { headers });
    const communes = response.data.data;

    const wilayas_list = communes.filter(
      (commune) => commune.is_deliverable === 1,
    );

    return wilayas_list;
  }

  async fetchCommunes({
    willayaID,
    stopDesk,
  }: {
    willayaID: number;
    stopDesk: boolean;
  }) {
    if (Number.isNaN(willayaID)) throw Error('Invalid wilaya');

    let url; //! A probleme with yaldine api, it doesn't return the right data when we filter by has_stop_desk
    if (stopDesk)
      url = `https://api.yalidine.app/v1/communes/?has_stop_desk=true&wilaya_id=${willayaID}`;
    else url = `https://api.yalidine.app/v1/communes/?wilaya_id=${willayaID}`;

    const headers = {
      'X-API-ID': process.env.YALIDINE_API_ID,
      'X-API-TOKEN': process.env.YALIDINE_API_TOKEN,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(url, { headers });
    const communes = response.data.data;

    const communes_list = communes.filter(
      (commune) => commune.is_deliverable === 1,
    );

    return communes_list;
  }
}
