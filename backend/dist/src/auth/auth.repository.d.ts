import { PrismaService } from '../prisma/prisma.service';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        nickname: string;
        passwordHash: string;
    } | null>;
    create(data: {
        email: string;
        nickname: string;
        passwordHash: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        nickname: string;
    }>;
}
