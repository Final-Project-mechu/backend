import { IsEmail, IsString, IsEnum, IsNotEmpty } from 'class-validator';

enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class CreateFriendDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string; // 친구 요청한 사용자의 이메일

  @IsEmail()
  @IsNotEmpty()
  readonly receiverEmail: string; // 친구 요청을 받은 사용자의 이메일
}
