import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthenticationContextType {
    token?: string;
    setToken: (token: string) => void;
}

const AuthenticationContext = createContext<AuthenticationContextType>(undefined!);

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [token, setToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem('robohub:token');
        if (token !== null) {
            setToken(token);
        }
    }, []);

    const saveToken = useCallback((token: string) => {
        localStorage.setItem('robohub:token', token);
        setToken(token);
    }, []);

    return (
        <AuthenticationContext.Provider value={useMemo(() => ({ token, setToken: saveToken }), [token, saveToken])}>{children}</AuthenticationContext.Provider>
    );
};

export const useAuthenticationContext = () => useContext(AuthenticationContext);
