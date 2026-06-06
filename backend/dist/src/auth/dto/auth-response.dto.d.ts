declare class UserInfo {
    id: number;
    email: string;
    nickname: string;
}
export declare class SignupResponseDto {
    id: number;
    email: string;
    nickname: string;
    createdAt: Date;
}
export declare class LoginResponseDto {
    accessToken: string;
    user: UserInfo;
}
export {};
