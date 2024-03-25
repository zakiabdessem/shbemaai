export interface Option {
  name: string;
  quantity: number;
}

export class Cart {
  products: [
    {
      product: string;
      options: [Option];
      quantity: number;
    },
  ];
  coupon?: string;
}
