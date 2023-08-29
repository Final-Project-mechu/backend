import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Feed } from 'src/entity/feed.entity';
import { User } from 'src/entity/user.entity';
import { FeedService } from 'src/feed/feed.service';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Feed])],
  controllers: [CommentsController],
<<<<<<< HEAD
  providers: [CommentsService,FeedService,UsersService,JwtService,MailService]
  
=======
  providers: [
    CommentsService,
    FeedService,
    UsersService,
    JwtService,
    MailService,
  ],
>>>>>>> 4f63e9656fbd0269f1d24c4b36211bdacc127b8f
})
export class CommentsModule {}
