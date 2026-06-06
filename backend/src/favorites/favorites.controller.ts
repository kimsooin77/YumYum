import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: '관심상품 등록 (좋아요)' })
  @ApiCreatedResponse()
  @Post()
  create(@Body() dto: CreateFavoriteDto, @CurrentUser() user: CurrentUserPayload) {
    return this.favoritesService.create(user.id, dto);
  }

  @ApiOperation({ summary: '관심상품 해제 (좋아요 취소)' })
  @ApiOkResponse()
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.favoritesService.delete(id, user.id);
  }

  @ApiOperation({ summary: '내 관심상품 목록 조회' })
  @Get()
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.favoritesService.findAll(user.id, Number(page), Number(limit));
  }
}
