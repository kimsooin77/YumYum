import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FavoritesRepository } from './favorites.repository';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  async create(userId: number, dto: CreateFavoriteDto) {
    const existing = await this.favoritesRepository.findByUserAndSnack(userId, dto.snackId);
    if (existing) throw new ConflictException('이미 좋아요한 과자입니다.');
    return this.favoritesRepository.create(userId, dto.snackId);
  }

  async delete(id: number, userId: number) {
    const favorite = await this.favoritesRepository.findById(id);
    if (!favorite) throw new NotFoundException('좋아요 항목을 찾을 수 없습니다.');
    if (favorite.userId !== userId) throw new ForbiddenException('권한이 없습니다.');
    await this.favoritesRepository.delete(id);
    return { message: '관심상품이 해제되었습니다.' };
  }

  async findAll(userId: number, page: number, limit: number) {
    const { data, total } = await this.favoritesRepository.findAllByUserId(userId, page, limit);
    const totalPages = Math.ceil(total / limit);
    return { data, meta: { total, page, limit, totalPages } };
  }
}
