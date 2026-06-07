import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SnackQueryDto } from './dto/snack-query.dto';

const snackInclude = {
  brand: { select: { id: true, name: true } },
  category: { select: { id: true, name: true } },
  _count: { select: { reviews: true, favorites: true } },
  reviews: { select: { rating: true } },
};

@Injectable()
export class SnacksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SnackQueryDto, userId?: number | null) {
    const { page, limit, categoryId, brandId, sort, dateRange } = query;
    const skip = (page - 1) * limit;

    let releaseDateFilter: { gte: Date } | undefined;
    if (dateRange) {
      const from = new Date();
      if (dateRange === 'today') {
        from.setHours(0, 0, 0, 0);
      } else if (dateRange === 'week') {
        from.setDate(from.getDate() - 7);
      } else if (dateRange === 'month') {
        from.setDate(from.getDate() - 30);
      }
      releaseDateFilter = { gte: from };
    }

    const where = {
      ...(categoryId && { categoryId }),
      ...(brandId && { brandId }),
      ...(releaseDateFilter && { releaseDate: releaseDateFilter }),
    };

    const orderBy =
      sort === 'rating'
        ? { reviews: { _count: 'desc' as const } }
        : sort === 'popular'
          ? { favorites: { _count: 'desc' as const } }
          : { releaseDate: 'desc' as const };

    const include = {
      ...snackInclude,
      ...(userId && {
        favorites: { where: { userId }, select: { id: true } },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.snack.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
      }),
      this.prisma.snack.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: number) {
    return this.prisma.snack.findUnique({
      where: { id },
      include: snackInclude,
    });
  }

  async findNew(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const where = { releaseDate: { gte: thirtyDaysAgo } };

    const [data, total] = await Promise.all([
      this.prisma.snack.findMany({
        where,
        skip,
        take: limit,
        orderBy: { releaseDate: 'desc' },
        include: snackInclude,
      }),
      this.prisma.snack.count({ where }),
    ]);

    return { data, total };
  }

  async search(keyword: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where = { name: { contains: keyword, mode: 'insensitive' as const } };

    const [data, total] = await Promise.all([
      this.prisma.snack.findMany({
        where,
        skip,
        take: limit,
        orderBy: { releaseDate: 'desc' },
        include: snackInclude,
      }),
      this.prisma.snack.count({ where }),
    ]);

    return { data, total };
  }

  async findByIds(ids: number[]) {
    return this.prisma.snack.findMany({
      where: { id: { in: ids } },
      include: snackInclude,
    });
  }
}
