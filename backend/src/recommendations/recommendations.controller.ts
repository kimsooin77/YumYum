import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { RecommendationsService } from './recommendations.service';

@ApiTags('recommendations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @ApiOperation({ summary: 'AI 맞춤 추천' })
  @ApiQuery({ name: 'limit', required: false, description: '추천 과자 수 (기본: 10)' })
  @Get()
  recommend(
    @CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit: string = '10',
  ) {
    return this.recommendationsService.recommend(user.id, Number(limit));
  }
}
