import { Body, Get, HttpException, HttpStatus, Injectable, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create.comments.dto';
import { User } from 'src/entity/user.entity';
import { Feed } from 'src/entity/feed.entity';
import { Comment } from 'src/entity/comment.entity';

@Injectable()
export class CommentsService {
    constructor(
        //  @InjectRepository(User)
        //  private userRepository: Repository<User>,
        //  @InjectRepository(Feed)
        //  private feedRepository: Repository<Feed>,
         @InjectRepository(Comment)
         private commentRepository: Repository<Comment>,
            ) {}
            
    findAll(): Promise<Comment[]> {
        return this.commentRepository.find()
    }
    
   async find(commentId: number) {
        return this.commentRepository.findOne({
            where: { id: commentId}
             })

        // if (!comment) throw new HttpException('NotFound', HttpStatus.NOT_FOUND)

        //     return comment
    }
}