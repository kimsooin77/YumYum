import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SnacksRepository } from './snacks.repository';
import { SnackQueryDto, SearchQueryDto } from './dto/snack-query.dto';

export interface BlogPost {
  title: string;
  link: string;
  description: string;
  bloggerName: string;
  postDate: string;
}

function formatSnack(snack: any) {
  const ratings = snack.reviews?.map((r: any) => r.rating) ?? [];
  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
      : null;

  const favoriteId = snack.favorites?.[0]?.id ?? null;

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
    avgRating: averageRating ?? 0,
    reviewCount: snack._count?.reviews ?? 0,
    favoriteCount: snack._count?.favorites ?? 0,
    isFavorited: favoriteId != null,
    ...(favoriteId != null && { favoriteId }),
  };
}

@Injectable()
export class SnacksService {
  constructor(private readonly snacksRepository: SnacksRepository) {}

  async findAll(query: SnackQueryDto, userId?: number | null) {
    const { data, total } = await this.snacksRepository.findAll(query, userId);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: data.map((s) => formatSnack(s)),
      total,
      page: query.page,
      limit: query.limit,
      totalPages,
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
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getBlogReviews(snackId: number): Promise<BlogPost[]> {
    const snack = await this.snacksRepository.findById(snackId);
    if (!snack) throw new NotFoundException('과자를 찾을 수 없습니다.');

    try {
      const query = encodeURIComponent(snack.name);
      const url = `https://search.naver.com/search.naver?where=blog&query=${query}`;
      const { data: html } = await axios.get<string>(url, {
        timeout: 8000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'ko-KR,ko;q=0.9',
        },
      });

      const $ = cheerio.load(html);
      const posts: BlogPost[] = [];

      // Naver blog search result selectors (as of 2025-2026)
      $('.total_wrap').each((_, el) => {
        const titleEl = $(el).find('.title_link').first();
        const title = titleEl.text().trim();
        const link = titleEl.attr('href') ?? '';
        if (!title || !link) return;

        const description = $(el).find('.dsc_txt, .api_txt_lines').first().text().trim();
        const bloggerName = $(el).find('.user_info .name, .sub_txt .name').first().text().trim();
        const postDate = $(el).find('.sub_txt .sub_time, .sub_txt .date').first().text().trim();

        posts.push({ title, link, description, bloggerName, postDate });
      });

      return posts.slice(0, 5);
    } catch {
      return [];
    }
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
      total,
      page: query.page,
      limit: query.limit,
      totalPages,
    };
  }
}
