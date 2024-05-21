export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
}

export enum PaymentType {
  CASH = 'cash',
  CIB = 'cib',
}

export enum PaymentTypeBussiness {
  CASH = 'cash',
}

export enum OrderType {
  CLIENT = 'client',
  BUSSINESS = 'bussiness',
}
