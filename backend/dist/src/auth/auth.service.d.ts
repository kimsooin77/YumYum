import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        id: number;
        createdAt: Date;
        email: string;
        nickname: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            nickname: string;
        };
    }>;
}
