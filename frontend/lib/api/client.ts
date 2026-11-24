import { toast } from "sonner";
import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from "axios";
import { ApiResponse, ApiErrorBody } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const REFRESH_ENDPOINT = "/user/refresh-token";
// Extended timeout for Render free tier cold starts (up to 45 seconds)
const TIMEOUT = 45_000;

interface RefreshData {
    accessToken: string;
}
type RefreshResponse = ApiResponse<RefreshData>;

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

export type ServerStatus = "normal" | "slow" | "offline" | "waking" | "online";
type StatusListener = (status: ServerStatus) => void;
const statusListeners = new Set<StatusListener>();

export const registerServerStatusListener = (fn: StatusListener) => {
    statusListeners.add(fn);
    return () => statusListeners.delete(fn);
};

const notifyStatus = (status: ServerStatus) => {
    statusListeners.forEach((fn) => {
        try {
            fn(status);
        } catch {
            // Ignore listener errors
        }
    });
};

export const checkServerHealth = async (): Promise<boolean> => {
    try {
        const res = await axios.get(`${BASE_URL}/health`, {
            timeout: 5000,
            withCredentials: true,
        });
        return res.status === 200;
    } catch {
        return false;
    }
};

declare module "axios" {
    interface InternalAxiosRequestConfig {
        _retry?: boolean;
        skipAuthRefresh?: boolean;
        _slowTimer?: NodeJS.Timeout;
    }
}

// for standard api request
export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// for refresh token request
export const refreshClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let activePendingSlowRequests = 0;

// Request interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (accessToken) {
            config.headers.set("Authorization", `Bearer ${accessToken}`);
        } else {
            config.headers.delete("Authorization");
        }

        // Detect requests taking longer than 2.5s (likely cold start)
        if (typeof window !== "undefined") {
            config._slowTimer = setTimeout(() => {
                activePendingSlowRequests += 1;
                notifyStatus("waking");
            }, 2500);
        }

        return config;
    }
);

let refreshPromise: Promise<string> | null = null;
export const refreshToken = async (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                const result = await refreshClient.post<RefreshResponse>(
                    REFRESH_ENDPOINT,
                    {}
                );
                const newToken = result.data.data?.accessToken;

                if (!newToken || typeof newToken !== "string") {
                    throw new Error("Refresh response did not contain an access token");
                }
                setAccessToken(newToken);
                return newToken;
            } catch (error) {
                setAccessToken(null);
                throw error;
            } finally {
                refreshPromise = null;
            }
        })();
    }
    return refreshPromise;
};

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        const config = response.config;
        if (config._slowTimer) {
            clearTimeout(config._slowTimer);
        }
        if (activePendingSlowRequests > 0) {
            activePendingSlowRequests = Math.max(0, activePendingSlowRequests - 1);
            if (activePendingSlowRequests === 0) {
                notifyStatus("online");
            }
        }
        return response;
    },
    async (error: AxiosError<ApiErrorBody>) => {
        const originalRequest = error.config;

        if (originalRequest?._slowTimer) {
            clearTimeout(originalRequest._slowTimer);
        }
        if (activePendingSlowRequests > 0) {
            activePendingSlowRequests = Math.max(0, activePendingSlowRequests - 1);
        }

        // Check if error is network/timeout/502/503/504 related to backend cold start
        const isNetworkOrColdStart =
            !error.response ||
            error.code === "ECONNABORTED" ||
            error.code === "ERR_NETWORK" ||
            (error.response.status >= 502 && error.response.status <= 504);

        if (isNetworkOrColdStart) {
            notifyStatus("offline");
        }

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.skipAuthRefresh ||
            originalRequest.url === REFRESH_ENDPOINT
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        try {
            const newToken = await refreshToken();
            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
            return apiClient.request(originalRequest);
        } catch (refreshErr) {
            if (accessToken) {
                toast.error("Your session has expired. Please log in again.", {
                    id: "session-expired",
                });
            }
            return Promise.reject(refreshErr);
        }
    }
);

export const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
        return (
            error.response?.data?.message ??
            error.response?.data?.error ??
            error.message ??
            "An unexpected API error occurred"
        );
    }

    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred";
};
