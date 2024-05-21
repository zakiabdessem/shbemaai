import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentType, PaymentTypeBussiness } from '../order.entity';
import { ClientCreateDto } from 'src/client/dtos/create-client.dto';

export class OrderCreateDtoClient {
  @IsNotEmpty()
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  paymentType: String;

  @IsNotEmpty()
  client: ClientCreateDto;

  @IsBoolean()
  @IsNotEmpty()
  isStopDesk: boolean;
}

export class OrderCreateDtoBussiness {
  @IsNotEmpty()
  @IsEnum(PaymentTypeBussiness, { message: 'Invalid payment type' })
  paymentType: String;

  @IsNotEmpty()
  client: ClientCreateDto;

  @IsNotEmpty()
  product: string;

  @IsNotEmpty()
  price: number

  @IsNotEmpty()
  option: string;
  
  @IsNotEmpty()
  quantity: number

  @IsOptional()
  note: string
}
