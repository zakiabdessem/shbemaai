export interface Category {
  name: string;
  _id: string | undefined;
}

export interface Option {
  name: string;
  image: File | string | null;
  changed: boolean;
  track: boolean;
  inStock?: boolean;
  quantity?: number;
}
