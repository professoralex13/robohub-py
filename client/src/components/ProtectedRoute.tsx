import { Profile, useProfileContext } from 'contexts/ProfileContext';
import { FC, PropsWithChildren, createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteContext = createContext<Profile>(undefined!);

export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
    const profile = useProfileContext();

    if (!profile) {
        return <Navigate to="/" />;
    }

    return (
        <ProtectedRouteContext.Provider value={profile}>
            {children}
        </ProtectedRouteContext.Provider>
    );
};

export const useProtectedRouteProfile = () => useContext(ProtectedRouteContext);
