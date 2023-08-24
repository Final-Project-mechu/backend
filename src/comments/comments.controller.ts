import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, ValidationPipe,  UseFilters, HttpException } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-expception.filter';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comments.dto';

@Controller('comments')
@UseFilters(HttpExceptionFilter)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}


    @Get()
    findAll() {
        throw new HttpException('api broken', 401)
        return this.commentsService.findAll()
    }

    @Get(':id')

       find(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.commentsService.find(id)
    }

//     @Post()
//     create(
//         @Body(new ValidationPipe()) data: CreateCommentDto
//     ) {
//         return this.commentsService.create(data)
//     }

//     @Put(':id')
//     update(
//         @Param('id', ParseIntPipe) id: number,
//         @Body(new ValidationPipe()) data: UpdateCommetDto

//         return this.commentsService.update(id, data)
//     }

// 
}