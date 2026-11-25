"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { UserProfile } from "@/types/api";
import { refreshToken, setAccessToken } from "@/lib/api/client";
import {
    getProfileApi,
    loginApi,
    logoutApi,
    registerApi,
    createGuestApi,
    LoginInput,
    RegisterInput,
} from "@/lib/api/auth";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { setUser as setReduxUser, clearUser as clearReduxUser, setLoading as setReduxLoading } from "@/redux/slices/user";
import { queryClient } from "@/helpers/tanstack";

interface AuthContextValue {
    user: UserProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    startGuestSession: () => Promise<string>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    const syncUser = useCallback((userData: UserProfile | null) => {
        setUser(userData);
        if (userData) {
            dispatch(
                setReduxUser({
                    id: userData.id,
                    name: userData.username,
                    email: userData.email,
                    profileImage: userData.profileImage || "",
                    isPro: userData.isPro,
                    isGuest: userData.isGuest ?? false,
                    freeAiTrials: userData.freeAiTrials ?? 0,
                    subscriptionStatus: userData.subscriptionStatus || null,
                    status: "authenticated",
                })
            );
        } else {
            dispatch(clearReduxUser());
        }
    }, [dispatch]);

    const refreshProfile = useCallback(async () => {
        try {
            const response = await getProfileApi();
            const profile = response.data;
            if (profile) {
                syncUser(profile);
            }
        } catch {
            syncUser(null);
            setAccessToken(null);
        }
    }, [syncUser]);

    useEffect(() => {
        let cancelled = false;

        const restoreSession = async () => {
            dispatch(setReduxLoading());
            try {
                // Populate in-memory access token from refresh cookie if available
                try {
                    await refreshToken();
                } catch {
                    // Refresh failed (no cookie or expired), proceed to check profile
                }
                const response = await getProfileApi();
                const profile = response.data;
                if (!cancelled && profile) {
                    syncUser(profile);
                }
            } catch {
                if (!cancelled) {
                    syncUser(null);
                    setAccessToken(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void restoreSession();
        return () => {
            cancelled = true;
        };
    }, [dispatch, syncUser]);

    const login = async (input: LoginInput) => {
        const response = await loginApi(input);
        const authData = response.data;
        if (!authData || !authData.user) {
            throw new Error(response.message || "Login response is missing authentication data");
        }
        setAccessToken(authData.accessToken || null);
        syncUser(authData.user);
    };

    const register = async (input: RegisterInput) => {
        const response = await registerApi(input);
        const authData = response.data;
        if (!authData || !authData.user) {
            throw new Error(response.message || "Registration response is missing authentication data");
        }
        setAccessToken(authData.accessToken || null);
        syncUser(authData.user);
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout API failed, continuing client cleanup:", error);
        } finally {
            syncUser(null);
            setAccessToken(null);
            queryClient.clear();
        }
    };

    const startGuestSession = useCallback(async (): Promise<string> => {
        dispatch(setReduxLoading());
        try {
            const response = await createGuestApi();
            const data = response.data;
            if (!data?.user || !data.accessToken) {
                throw new Error("Failed to initialize guest session");
            }
            setAccessToken(data.accessToken);
            syncUser(data.user);
            void queryClient.invalidateQueries();
            return data.documentId;
        } catch (error) {
            syncUser(null);
            throw error;
        }
    }, [dispatch, syncUser]);

    const value: AuthContextValue = {
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        register,
        startGuestSession,
        logout,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }

    return context;
};

