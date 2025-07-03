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

export interface UserState {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
}