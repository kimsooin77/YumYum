import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SnacksRepository } from './snacks.repository';
import { SnackQueryDto, SearchQueryDto } from './dto/snack-query.dto';

function formatSnack(snack: any, favoriteId?: number | null) {
  const ratings = snack.reviews?.map((r: any) => r.rating) ?? [];
  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
      : null;

  return {
    id: snack.id,
    name: snack.name,
    brand: snack.brand,
    category: snack.category,
    description: snack.description,
    imageUrl: snack.imageUrl,
    price: snack.price,
    releaseDate: snack.releaseDate,
    createdAt: snack.createdAt,
    averageRating,
    reviewCount: snack._count?.reviews ?? 0,
    isFavorited: favoriteId != null,
    ...(favoriteId != null && { favoriteId }),
  };
}

@Injectable()
export class SnacksService {
  constructor(private readonly snacksRepository: SnacksRepository) {}

  async findAll(query: SnackQueryDto) {
    const { data, total } = await this.snacksRepository.findAll(query);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: data.map((s) => formatSnack(s)),
      meta: { total, page: query.page, limit: query.limit, totalPages },
    };
  }

  async findById(id: number) {
    const snack = await this.snacksRepository.findById(id);
    if (!snack) throw new NotFoundException('과자를 찾을 수 없습니다.');
    return formatSnack(snack);
  }

  async findNew(page: number, limit: number) {
    const { data, total } = await this.snacksRepository.findNew(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((s) => formatSnack(s)),
      meta: { total, page, limit, totalPages },
    };
  }

  async search(query: SearchQueryDto) {
    if (!query.q || query.q.trim().length < 2) {
      throw new BadRequestException('검색어는 2자 이상이어야 합니다.');
    }

    const { data, total } = await this.snacksRepository.search(
      query.q.trim(),
      query.page,
      query.limit,
    );
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: data.map((s) => formatSnack(s)),
      meta: { total, page: query.page, limit: query.limit, totalPages },
    };
  }
}
