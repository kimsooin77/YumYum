import { PrismaService } from '../prisma/prisma.service';
export declare class UsersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: number): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        nickname: string;
    } | null>;
}
