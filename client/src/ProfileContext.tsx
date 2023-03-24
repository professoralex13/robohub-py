import { FC, PropsWithChildren, createContext, useContext } from 'react';
import useSWR from 'swr';
import { useRequest } from './hooks/useRequest';
import { useAuthenticationContext } from './AuthenticationContext';

export interface Profile {
    email: string;
    username: string;
    fullName?: string;
}

const ProfileContext = createContext<Profile | undefined>(undefined);

export const ProfileContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const request = useRequest();

    const { token } = useAuthenticationContext();

    // Pass token into key array to force revalidation when token changes
    const { data } = useSWR(['/account/profile', token], ([url]) => request<Profile>(url, 'GET').then((response) => response.data).catch(() => null), { suspense: true });
    // Value of query fail must be null otherwise suspense will act like it is still loading
    return (
        <ProfileContext.Provider value={data ?? undefined}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => useContext(ProfileContext);
