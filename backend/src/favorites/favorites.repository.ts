import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, snackId: number) {
    return this.prisma.favorite.create({
      data: { userId, snackId },
    });
  }

  async delete(id: number) {
    return this.prisma.favorite.delete({ where: { id } });
  }

  async findById(id: number) {
    return this.prisma.favorite.findUnique({ where: { id } });
  }

  async findByUserAndSnack(userId: number, snackId: number) {
    return this.prisma.favorite.findUnique({
      where: { userId_snackId: { userId, snackId } },
    });
  }

  async findAllByUserId(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          snack: {
            include: {
              brand: { select: { id: true, name: true } },
              category: { select: { id: true, name: true } },
              _count: { select: { reviews: true, favorites: true } },
              reviews: { select: { rating: true } },
            },
          },
        },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return { data, total };
  }

  async findUserFavoriteSnackIds(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { snackId: true },
    });
    return favorites.map((f) => f.snackId);
  }
}
