import { IsNumber,IsString,Length  } from "class-validator";

export class updateFoodsDto{
    @IsString()
    readonly food_name: string;

    @IsNumber()
    readonly category_id: number;    
}