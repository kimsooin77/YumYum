import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: '리뷰 작성' })
  @ApiCreatedResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @CurrentUser() user: CurrentUserPayload) {
    return this.reviewsService.create(user.id, dto);
  }

  @ApiOperation({ summary: '리뷰 수정 (본인만)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.reviewsService.update(id, user.id, dto);
  }

  @ApiOperation({ summary: '리뷰 삭제 (본인만)' })
  @ApiOkResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.reviewsService.delete(id, user.id);
  }

  @ApiOperation({ summary: '특정 과자의 리뷰 목록 조회' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['newest', 'highest', 'lowest'] })
  @Get('snack/:snackId')
  findAllBySnack(
    @Param('snackId', ParseIntPipe) snackId: number,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sort') sort: 'newest' | 'highest' | 'lowest' = 'newest',
  ) {
    return this.reviewsService.findAllBySnackId(snackId, Number(page), Number(limit), sort);
  }
}
