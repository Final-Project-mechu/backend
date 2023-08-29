import { IsEmail, IsString, IsEnum, IsNotEmpty } from 'class-validator';

enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class CreateFriendDto {
  @IsEmail()
  @IsNotEmpty()
  readonly receiverEmail: string; // 친구 요청을 받은 사용자의 이메일

  @IsEmail()
  @IsNotEmpty()
  readonly sender: string; // 친구 요청을 보낸 사용자의 이메일

  @IsEnum(FriendRequestStatus)
  readonly status: FriendRequestStatus; // 친구 요청 상태 (pending, accepted, rejected)
}
