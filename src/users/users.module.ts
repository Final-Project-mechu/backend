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
<<<<<<< HEAD
// import { FriendModule } from 'src/friend/friend.module';
// import { FriendsService } from 'src/friend/friend.service';
=======
import { FriendModule } from 'src/friend/friend.module';
import { FriendsService } from 'src/friend/friend.service';
import { Friends } from 'src/entity/friend.entity';
>>>>>>> 4f63e9656fbd0269f1d24c4b36211bdacc127b8f

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends]),
    MailModule,
<<<<<<< HEAD
    // FriendModule,
=======
    FriendModule,
>>>>>>> 4f63e9656fbd0269f1d24c4b36211bdacc127b8f
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
<<<<<<< HEAD
  providers: [UsersService, MailService],
=======
  providers: [UsersService, MailService, FriendsService],
>>>>>>> 4f63e9656fbd0269f1d24c4b36211bdacc127b8f
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}