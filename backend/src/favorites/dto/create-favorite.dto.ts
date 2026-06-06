import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ description: '과자 ID' })
  @IsInt()
  snackId: number;
}
