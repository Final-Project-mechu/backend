import { IsNumber,IsString,Length  } from "class-validator";

export class createFoodsDto{
    @IsString()
    readonly food_name: string;

    @IsNumber()
    readonly category_id: number;    
}