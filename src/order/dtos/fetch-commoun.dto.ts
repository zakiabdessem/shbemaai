import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class fetchCommunDTO {
  @IsBoolean()
  @IsNotEmpty()
  stopDesk: boolean;

  @IsNumber()
  @IsNotEmpty()
  willayaID: number;
}
