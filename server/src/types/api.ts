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

export interface AuthData {
    accessToken: string;
    user: {
        id: string;
        username: string;
        email: string;
        profileImage?: string;
        isPro: boolean;
        subscriptionStatus: string | null;
    };
}

