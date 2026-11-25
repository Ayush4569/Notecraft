import { apiClient } from "./client";
import { ApiResponse, AuthData, UserProfile } from "@/types/api";

export interface LoginInput {
    identifier: string;
    password: string;
}

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

export interface VerifyRegisterInput {
    username: string;
    code: string;
}

export interface VerifyForgotInput {
    email: string;
    otp: string;
}

export interface ForgotPasswordInput {
    newPassword: string;
    resetToken: string;
}

export interface ChangePasswordInput {
    password: string;
}

export interface GuestAuthData {
    user: UserProfile;
    accessToken: string;
    documentId: string;
}

export const createGuestApi = async (): Promise<ApiResponse<GuestAuthData>> => {
    const res = await apiClient.post<ApiResponse<GuestAuthData>>("/user/guest", {});
    return res.data;
};

export const getProfileApi = async (): Promise<ApiResponse<UserProfile>> => {
    const res = await apiClient.get<ApiResponse<UserProfile>>("/user");
    return res.data;
};

export const loginApi = async (input: LoginInput): Promise<ApiResponse<AuthData>> => {
    const res = await apiClient.post<ApiResponse<AuthData>>("/user/login", input);
    return res.data;
};

export const registerApi = async (input: RegisterInput): Promise<ApiResponse<AuthData>> => {
    const res = await apiClient.post<ApiResponse<AuthData>>("/user/signup", input);
    return res.data;
};

export const verifyRegisterCodeApi = async (input: VerifyRegisterInput): Promise<ApiResponse<AuthData>> => {
    const res = await apiClient.post<ApiResponse<AuthData>>("/user/verify-code?key=register", input);
    return res.data;
};

export const verifyForgotCodeApi = async (input: VerifyForgotInput): Promise<ApiResponse<{ resetToken: string }>> => {
    const res = await apiClient.post<ApiResponse<{ resetToken: string }>>("/user/verify-code?key=forgot", input);
    return res.data;
};

export const resetPasswordOtpApi = async (email: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>("/user/resetOtp", { email });
    return res.data;
};

export const forgotPasswordApi = async (input: ForgotPasswordInput): Promise<ApiResponse<void>> => {
    const res = await apiClient.patch<ApiResponse<void>>("/user/forgotPassword", input);
    return res.data;
};

export const changePasswordApi = async (input: ChangePasswordInput): Promise<ApiResponse<void>> => {
    const res = await apiClient.patch<ApiResponse<void>>("/user/changePassword", input);
    return res.data;
};

export const logoutApi = async (): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>("/user/logout", {});
    return res.data;
};

