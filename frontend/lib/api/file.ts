import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";

export const deleteFileApi = async (url: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/file/delete?url=${encodeURIComponent(url)}`);
    return res.data;
};

