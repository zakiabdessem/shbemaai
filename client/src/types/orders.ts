export interface Order {
  _id: string;
  createdAt: String;
  status: string;
  paymentType: string;
  cart: {
    products: {
      quantity: number;
    }[];
    totalPrice: number;
    subTotal: number;
  };
  client: {
    firstName: string;
    lastName: string;
    address: {
      city: string;
      phone: string;
    };
  };
}
