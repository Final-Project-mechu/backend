import { IsNumber,IsString,Length  } from "class-validator";

export class updateCategoryDto{

    @IsString()
    readonly category_name: string;

    @IsNumber()
    readonly top_category_id: number;
    
}

