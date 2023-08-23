import { Body, Get, Injectable, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create.comments.dto';
import { User } from 'src/entity/user.entity';
import { Feed } from 'src/entity/feed.entity';

@Injectable()
export class CommentsService {
    // constructor(
    //     @InjectRepository(User)
    //      private userRepository: Repository<User>,
    //      @InjectRepository(Feed)
    //      private feedRepository: Repository<Feed>
    //         ) {}
            
    @Get()
    async getAllComments() {
        return 'hello world'
    }
    @Post(':id')
    async createComment( id: string, comments: CreateCommentDto){
        return 'hello world'
    }

}

