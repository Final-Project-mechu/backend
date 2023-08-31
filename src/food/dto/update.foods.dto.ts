import { IsNumber,IsString,Length  } from "class-validator";

export class updateFoodsDto{
    @IsString()
    @Length(5, 15)
    readonly food_name: string;

    @IsNumber()
    readonly category_id: number;    
}