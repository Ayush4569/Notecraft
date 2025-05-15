export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    profileImage?: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    documents: Document[];
    comments: Comment[];
}