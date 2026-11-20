import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";

export interface FormatTextInput {
    selectedText: string;
    prompt?: string;
}

export interface FormatTextResponse {
    formattedText: string;
}

export const formatTextApi = async (input: FormatTextInput): Promise<ApiResponse<FormatTextResponse>> => {
    const res = await apiClient.post<ApiResponse<FormatTextResponse>>("/ai/format-text", input);
    return res.data;
};
