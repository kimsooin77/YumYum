import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const reviewInclude = {
  user: { select: { id: true, nickname: true } },
};

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: number; snackId: number; rating: number; content: string }) {
    return this.prisma.review.create({ data, include: reviewInclude });
  }

  async update(id: number, data: { rating?: number; content?: string }) {
    return this.prisma.review.update({ where: { id }, data, include: reviewInclude });
  }

  async delete(id: number) {
    return this.prisma.review.delete({ where: { id } });
  }

  async findById(id: number) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  async findByUserAndSnack(userId: number, snackId: number) {
    return this.prisma.review.findUnique({
      where: { userId_snackId: { userId, snackId } },
    });
  }

  async findAllBySnackId(
    snackId: number,
    page: number,
    limit: number,
    sort: 'newest' | 'highest' | 'lowest',
  ) {
    const skip = (page - 1) * limit;

    const orderBy =
      sort === 'highest'
        ? { rating: 'desc' as const }
        : sort === 'lowest'
          ? { rating: 'asc' as const }
          : { createdAt: 'desc' as const };

    const [data, total, aggregate] = await Promise.all([
      this.prisma.review.findMany({
        where: { snackId },
        skip,
        take: limit,
        orderBy,
        include: reviewInclude,
      }),
      this.prisma.review.count({ where: { snackId } }),
      this.prisma.review.aggregate({ where: { snackId }, _avg: { rating: true } }),
    ]);

    return { data, total, averageRating: aggregate._avg.rating };
  }

  async findAllByUserId(userId: number) {
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        snack: { select: { id: true, name: true, imageUrl: true } },
      },
    });
  }
}
