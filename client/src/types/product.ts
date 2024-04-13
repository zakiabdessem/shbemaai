export interface Category {
  name: string;
  _id: string;
  createdAt: string;
}

export interface Option {
  name: string;
  image: File | string | null;
  changed: boolean;
  track: boolean;
  inStock?: boolean;
  quantity?: number;
  price: number;
}
