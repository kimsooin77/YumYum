import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesRepository } from '../favorites/favorites.repository';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly favoritesRepository: FavoritesRepository,
  ) {}

  async recommend(userId: number, limit: number = 10) {
    const favoriteSnackIds = await this.favoritesRepository.findUserFavoriteSnackIds(userId);

    let categoryIds: number[] = [];
    let brandIds: number[] = [];

    if (favoriteSnackIds.length > 0) {
      const favoriteSnacks = await this.prisma.snack.findMany({
        where: { id: { in: favoriteSnackIds } },
        select: { categoryId: true, brandId: true },
      });
      categoryIds = [...new Set(favoriteSnacks.map((s) => s.categoryId))];
      brandIds = [...new Set(favoriteSnacks.map((s) => s.brandId))];
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 관심 카테고리 기반 신상품 추천
    const categoryBased =
      categoryIds.length > 0
        ? await this.prisma.snack.findMany({
            where: {
              categoryId: { in: categoryIds },
              id: { notIn: favoriteSnackIds },
              releaseDate: { gte: thirtyDaysAgo },
            },
            take: Math.ceil(limit / 2),
            orderBy: { releaseDate: 'desc' },
            include: {
              brand: { select: { id: true, name: true } },
              category: { select: { id: true, name: true } },
              reviews: { select: { rating: true } },
            },
          })
        : [];

    // 신상품 중 평점 높은 순 (fallback)
    const existing = new Set([...favoriteSnackIds, ...categoryBased.map((s) => s.id)]);
    const highRated = await this.prisma.snack.findMany({
      where: {
        id: { notIn: Array.from(existing) },
        releaseDate: { gte: thirtyDaysAgo },
      },
      take: limit - categoryBased.length,
      orderBy: { createdAt: 'desc' },
      include: {
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        reviews: { select: { rating: true } },
      },
    });

    const all = [...categoryBased, ...highRated].slice(0, limit);

    return {
      recommendations: all.map((snack) => {
        const ratings = snack.reviews.map((r) => r.rating);
        const averageRating =
          ratings.length > 0
            ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
            : null;
        const isCategoryBased = categoryBased.some((s) => s.id === snack.id);

        return {
          id: snack.id,
          name: snack.name,
          brand: snack.brand,
          category: snack.category,
          imageUrl: snack.imageUrl,
          price: snack.price,
          releaseDate: snack.releaseDate,
          averageRating,
          reviewCount: ratings.length,
          reason: isCategoryBased ? '관심 카테고리 기반 추천' : '신상품 추천',
        };
      }),
      generatedAt: new Date(),
    };
  }
}
