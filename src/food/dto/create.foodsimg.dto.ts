import { IsNumber, IsNumberString, IsString, Length,  } from 'class-validator';

export class CreateFoodsImgDto {
  @IsString()
  readonly food_name: string;

  @IsNumberString()
  readonly category_id: number;

//   @IsString()
//   readonly food_img: string;
}
