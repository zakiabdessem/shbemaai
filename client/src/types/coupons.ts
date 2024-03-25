export interface Coupon {
  _id: string;
  createdAt: string;
  code: string;
  discount: number;
  expireDate: string;
  isActive: boolean;
}
