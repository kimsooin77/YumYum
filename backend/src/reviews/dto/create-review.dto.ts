import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: '과자 ID' })
  @IsInt()
  snackId: number;

  @ApiProperty({ description: '별점 (1~5)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: '리뷰 내용 (최소 10자)' })
  @IsString()
  @MinLength(10)
  content: string;
}
