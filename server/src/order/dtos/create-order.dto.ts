import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentType } from '../order.entity';
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
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  paymentType: String;

  @IsNotEmpty()
  client: ClientCreateDto;
}
