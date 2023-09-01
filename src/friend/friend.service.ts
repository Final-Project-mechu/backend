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
import e from 'express';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends) private friendRepository: Repository<Friends>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UsersService,
  ) {}

  async getFriendInfo(receiverEmail: string) {
    const findAllFriend = await this.friendRepository.find({
      where: { receiverEmail, status: 'accepted' },
    });
    if (!findAllFriend || findAllFriend.length === 0) {
      throw new ConflictException(`친구가 존재하지 않습니다.`);
    }
  }

  // 로그인 후 친구 요청하는 로직
  async requestFriend(
    id: number,
    email: string,
    receiverEmail: string,
    status: string,
  ) {
    // 1. 요청대상이 실제 DB에 존재하는지 검증
    const receiver = await this.userService.getUserInfo(email);

    if (!receiver) {
      throw new NotFoundException(`회원을 찾을 수 없습니다.`);
    }

    // 2. 현재 친구 신청 중인지 검증
    const existRequest = await this.friendRepository.findOne({
      where: { receiverEmail },
    });

    if (existRequest) {
      throw new ConflictException(`이미 친구 요청을 보냈습니다.`);
    }

    // 3. 이후 1번 유저가 2번 유저에게 친구를 신청한 상태. 상태를 pending으로 설정
    // 해당 로직에서 신청한 유저의 정보도 표시를 해야하는데, 이 로직에서 user_id를 어떻게 설정하는 지 모르겠음 ㅠㅠ
    // 결국 sender를 하나 생성해서 생성자의 이메일을 받아오는식으로 구현함.. 이건 팀원들과 다시한번 이야기해야함

    const sender = this.userService.getUserInfo(email);

    const requestPending = new Friends();
    requestPending.sender = (await sender).email;
    requestPending.receiverEmail = receiverEmail;
    requestPending.status = 'pending';

    await this.friendRepository.save(requestPending);

    // const requestPending = new Friends();
    // (requestPending.receiverEmail = receiverEmail),
    //   (requestPending.status = 'pending');

    // await this.friendRepository.save(requestPending);
  }

  // 로그인 후 친구 요청 수락하는 로직
  // 1. 현재 로그인한 유저의 정보를 바탕으로 수락을 찾는다. 이거는 컨트롤러에서 request.locals.user로 해결
  // 요청을 받은 유저가 아닌 다른 유저가 수락을 못하게 하는 로직필요
  async acceptFriend(
    id: number,
    sender: string,
    receiverEmail: string,
    status: string,
  ) {
    const friendRequest = await this.friendRepository.findOne({
      where: { sender, receiverEmail, status: 'pending' },
    });

    if (!friendRequest) {
      throw new ConflictException('해당하는 친구 요청을 찾을 수 없습니다.');
    }

    if (friendRequest.status === 'accepted') {
      throw new ConflictException('이미 수락한 친구 요청입니다.');
    }

    if (sender !== receiverEmail) {
      throw new ConflictException(`권한이 없습니다.`);
    } else {
      friendRequest.status = 'accepted'; // 친구 요청 상태를 수락으로 변경
      await this.friendRepository.save(friendRequest);
    }
  }

  async rejectFriend(receiverEmail: string, status: string) {
    const friendRequest = await this.friendRepository.findOne({
      where: { receiverEmail, status: 'pending' },
    });

    if (!friendRequest) {
      throw new ConflictException('해당하는 친구 요청을 찾을 수 없습니다.');
    }
    await this.friendRepository.softDelete(friendRequest);
  }

  async deleteFriend(receiverEmail: string, status: string) {
    const existFriend = await this.friendRepository.find({
      where: { receiverEmail },
    });
    await this.friendRepository.remove(existFriend);
  }
}
