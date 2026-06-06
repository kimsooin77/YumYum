import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty() id: number;
  @ApiProperty() email: string;
  @ApiProperty() nickname: string;
}

export class SignupResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() email: string;
  @ApiProperty() nickname: string;
  @ApiProperty() createdAt: Date;
}

export class LoginResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty({ type: UserInfo }) user: UserInfo;
}
