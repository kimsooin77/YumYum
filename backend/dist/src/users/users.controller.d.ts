import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: any): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        nickname: string;
    }>;
}
