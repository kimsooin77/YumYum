import { UsersRepository } from './users.repository';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    findById(id: number): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        nickname: string;
    }>;
}
