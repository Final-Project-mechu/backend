import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendsService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from 'src/entity/friend.entity';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friends, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    MailModule,
  ],
  controllers: [FriendController],
  providers: [FriendsService, UsersService, MailService],
  exports: [FriendModule],
})
export class FriendModule {}
