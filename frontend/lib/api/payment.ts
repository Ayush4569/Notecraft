import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";

export interface SubscriptionData {
    subscriptionId: string;
    customerId: string;
    keyId: string;
}

export const createSubscriptionApi = async (): Promise<ApiResponse<SubscriptionData>> => {
    const res = await apiClient.post<ApiResponse<SubscriptionData>>("/payment/subscriptions/create", null);
    return res.data;
};

export const cancelSubscriptionApi = async (): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>("/payment/subscriptions/cancel");
    return res.data;
};
