export interface ApiResponse<T = void> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ApiErrorBody {
    success?: false;
    message?: string;
    error?: string;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    profileImage?: string;
    isPro: boolean;
    subscriptionStatus: string | null;
}

export interface AuthData {
    user: UserProfile;
    accessToken: string;
}

