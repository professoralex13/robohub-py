import { createContext, FC, PropsWithChildren, useState } from 'react';

interface AuthenticationContextType {
        token?: string;
}

export const AuthenticationContext = createContext<AuthenticationContextType>(undefined!);

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [token, setToken] = useState<string | undefined>(undefined);
    return (
        <AuthenticationContext.Provider value={{ token }}>{children}</AuthenticationContext.Provider>
    );
};
