import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";
import { Document, DocNode } from "@/types/document";
import { PartialBlock } from "@blocknote/core";

export interface CreateDocumentInput {
    title: string;
    parentId?: string | null;
}

export interface UpdateDocumentInput {
    title?: string;
    content?: { version?: string; blocks?: PartialBlock[] } | PartialBlock[] | string | null;
    icon?: string | null;
    coverImage?: string | null;
    isPublished?: boolean;
}

export const getAllDocumentsApi = async (): Promise<ApiResponse<DocNode[]>> => {
    const res = await apiClient.get<ApiResponse<DocNode[]>>("/document");
    return res.data;
};

export const getDocumentByIdApi = async (docId: string): Promise<ApiResponse<Document>> => {
    const res = await apiClient.get<ApiResponse<Document>>(`/document/${docId}`);
    return res.data;
};

export const getPublisedDocument = async (docId: string): Promise<ApiResponse<Document>> => {
    const res = await apiClient.get<ApiResponse<Document>>(`/document/published/${docId}`);
    return res.data;
};

export const getTrashedDocumentsApi = async (): Promise<ApiResponse<DocNode[]>> => {
    const res = await apiClient.get<ApiResponse<DocNode[]>>("/document/trashed");
    return res.data;
};

export const createDocumentApi = async (input: CreateDocumentInput): Promise<ApiResponse<DocNode>> => {
    const res = await apiClient.post<ApiResponse<DocNode>>("/document/create", input);
    return res.data;
};

export const updateDocumentApi = async (docId: string, input: UpdateDocumentInput): Promise<ApiResponse<Document>> => {
    const res = await apiClient.patch<ApiResponse<Document>>(`/document/update/${docId}`, input);
    return res.data;
};

export const archiveDocumentApi = async (docId: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.patch<ApiResponse<void>>(`/document/archive/${docId}`, {});
    return res.data;
};

export const restoreDocumentApi = async (docId: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.patch<ApiResponse<void>>(`/document/restore/${docId}`, {});
    return res.data;
};

export const deleteDocumentApi = async (docId: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/document/delete/${docId}`);
    return res.data;
};
