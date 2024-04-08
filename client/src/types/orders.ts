export interface Order {
  _id: string;
  createdAt: String;
  orderStatus: string;
  paymentType: string;
  isStopDesk: boolean;
  cart: {
    products: {
      product: string;
      options: {
        name: string;
        quantity: number;
      }[];
      quantity: number;
      title: string;
    }[];
    totalPrice: number;
    subTotal: number;
    note: string;
  };
  client: {
    firstName: string;
    lastName: string;
    address: {
      willaya: string;
      commun: string;
      phone: string;
    };
  };
}
