import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loading-icons';
import { useEffect } from 'react';
import { useAuthenticationContext } from '../AuthenticationContext';

export const Logout = () => {
    const { logout } = useAuthenticationContext();

    const navigate = useNavigate();

    useEffect(() => {
        logout().finally(() => navigate(-1));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="h-screen flex flex-row items-center justify-center gap-5">
            <span className="text-5xl">Logging you out</span> <Oval />
        </div>
    );
};
