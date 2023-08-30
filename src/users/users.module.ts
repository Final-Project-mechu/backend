import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { User } from 'src/entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { FriendModule } from 'src/friend/friend.module';
import { FriendsService } from 'src/friend/friend.service';
import { Friends } from 'src/entity/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends]),
    MailModule,
    FriendModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService, MailService, FriendsService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
