import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; nickname: string; passwordHash: string }) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
  }
}
