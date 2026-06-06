import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }
}
