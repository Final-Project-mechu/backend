import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from 'src/entity/friend.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateFriendDto } from './dto/create-friend.dto';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends) private friendRepository: Repository<Friends>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService,
  ) {}

  // async getFriendInfo(receiverEmail: string) {
  //   const findAllFriend = await this.friendRepository.find({
  //     where: { receiverEmail, status: 'accepted' },
  //   });
  //   if (!findAllFriend || findAllFriend.length === 0) {
  //     throw new ConflictException(`친구가 존재하지 않습니다.`);
  //   }
  // }

  async requestFriend(email: string, receiverEmail: string) {
    const sender = await this.userService.getUserInfo(email);
    if (!sender) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    const friendRequest = new Friends();
    friendRequest.email = email;
    friendRequest.receiverEmail = receiverEmail;

    try {
      await this.friendRepository.save(friendRequest);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  // async acceptFriend(
  //   id: number,
  //   sender: string,
  //   receiverEmail: string,
  //   status: string,
  // ) {
  //   const friendRequest = await this.friendRepository.findOne({
  //     where: { email},
  //   });

  //   if (!friendRequest) {
  //     throw new ConflictException('해당하는 친구 요청을 찾을 수 없습니다.');
  //   }

  //   if (friendRequest.status === 'accepted') {
  //     throw new ConflictException('이미 수락한 친구 요청입니다.');
  //   }

  //   if (!sender) {
  //     throw new ConflictException(`권한이 없습니다.`);
  //   } else {
  //     friendRequest.status = 'accepted'; // 친구 요청 상태를 수락으로 변경
  //     await this.friendRepository.save(friendRequest);
  //   }
  // }

  //   async rejectFriend(receiverEmail: string, status: string) {
  //     const friendRequest = await this.friendRepository.findOne({
  //       where: { receiverEmail, status: 'pending' },
  //     });

  //     if (!friendRequest) {
  //       throw new ConflictException('해당하는 친구 요청을 찾을 수 없습니다.');
  //     }
  //     await this.friendRepository.softDelete(friendRequest);
  //   }

  //   async deleteFriend(receiverEmail: string, status: string) {
  //     const existFriend = await this.friendRepository.find({
  //       where: { receiverEmail },
  //     });
  //     await this.friendRepository.remove(existFriend);
  //   }
}
