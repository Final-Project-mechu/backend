import { IsNumber, IsNumberString, IsString, Length } from 'class-validator';

export class createFoodsImagsDto {
  // @IsString()
  // filename: string;

  // @IsString()
  // url: string;

  @IsNumberString()
  readonly food_id: number;
}
