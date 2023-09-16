import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Feed } from 'src/entity/feed.entity';
import { User } from 'src/entity/user.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Feed])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
