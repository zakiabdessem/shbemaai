import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderType, PaymentType } from '../order.entity';
import { ClientCreateDto } from 'src/client/dtos/create-client.dto';

export class OrderCreateDtoClient {
  @IsNotEmpty()
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  paymentType: String;

  @IsNotEmpty()
  client: ClientCreateDto;
}

export class OrderCreateDtoBussiness {
  @IsNotEmpty()
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  paymentType: String;

  @IsNotEmpty()
  client: ClientCreateDto;
}