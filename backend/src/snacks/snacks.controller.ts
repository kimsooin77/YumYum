import { Controller, Get, Param, ParseIntPipe, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SnacksService } from './snacks.service';
import { SnackQueryDto, SearchQueryDto } from './dto/snack-query.dto';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

@ApiTags('snacks')
@Controller('snacks')
export class SnacksController {
  constructor(private readonly snacksService: SnacksService) {}

  @ApiOperation({ summary: '과자 목록 조회' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query() query: SnackQueryDto, @Request() req: any) {
    return this.snacksService.findAll(query, req.user?.id ?? null);
  }

  @ApiOperation({ summary: '신상품 목록 조회 (최근 30일)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get('new')
  findNew(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.snacksService.findNew(Number(page), Number(limit));
  }

  @ApiOperation({ summary: '과자 검색' })
  @Get('search')
  search(@Query() query: SearchQueryDto) {
    return this.snacksService.search(query);
  }

  @ApiOperation({ summary: '과자 블로그 후기 조회 (네이버 블로그)' })
  @Get(':id/blog-reviews')
  getBlogReviews(@Param('id', ParseIntPipe) id: number) {
    return this.snacksService.getBlogReviews(id);
  }

  @ApiOperation({ summary: '과자 상세 조회' })
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.snacksService.findById(id);
  }
}
