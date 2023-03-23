import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { useSWRConfig } from 'swr';
import { requestAuthorized } from './hooks/useRequest';

export interface Profile {
    email: string;
    username: string;
    fullName?: string;
}

interface AuthenticationContextType {
    token?: string;
    setToken: (token: string) => void;
    logout: () => Promise<void>;
}

const AuthenticationContext = createContext<AuthenticationContextType>(undefined!);

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [token, setToken] = useState<string | undefined>(() => {
        const token = localStorage.getItem('robohub:token');
        if (token !== null) {
            return token;
        }
        return undefined;
    });

    const { mutate } = useSWRConfig();

    const saveToken = useCallback((token: string) => {
        localStorage.setItem('robohub:token', token);
        setToken(token);

        // Clear all SWR cache when token changes
        mutate(
            () => true,
            undefined,
            { revalidate: false },
        );
    }, [mutate]);

    const logout = useCallback(async () => {
        if (!token) {
            return;
        }
        await requestAuthorized('/auth/logout', 'POST', token);
        setToken(undefined);
        localStorage.removeItem('robohub:token');
    }, [token]);

    return (
        <AuthenticationContext.Provider value={useMemo(() => ({ token, setToken: saveToken, logout }), [token, saveToken, logout])}>{children}</AuthenticationContext.Provider>
    );
};

export const useAuthenticationContext = () => useContext(AuthenticationContext);
