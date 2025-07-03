export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    profileImage: string | null;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    refreshToken: string | null;
}
