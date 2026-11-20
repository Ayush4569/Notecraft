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
    LoginInput,
    RegisterInput,
} from "@/lib/api/auth";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { setUser as setReduxUser, clearUser as clearReduxUser, setLoading as setReduxLoading } from "@/redux/slices/user";

interface AuthContextValue {
    user: UserProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
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
        if (!response.success) {
            throw new Error(response.message || "Registration failed");
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            syncUser(null);
            setAccessToken(null);
        }
    };

    const value: AuthContextValue = {
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        register,
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

