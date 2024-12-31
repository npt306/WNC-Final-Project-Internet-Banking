import {
  IsString,
  IsNumber,
  Min,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { TransferDto } from './transfer.dto';

export class TransferLogDto extends TransferDto {
  @IsNumber()
  @IsOptional()
  sender_balance: number;

  @IsNumber()
  @IsOptional()
  receiver_balance: number;
}
