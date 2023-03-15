import { Search } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Oval } from 'react-loading-icons';
import { useAsyncEffect } from '../hooks/useAsyncEffect';
import { useRequest } from '../hooks/useRequest';
import { Profile, useAuthenticationContext } from '../AuthenticationContext';

interface LinkProps {
    to: string;
}

const Link: FC<PropsWithChildren<LinkProps>> = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => clsx('text-xl link', isActive && 'underline text-navy-300')}>{children}</NavLink>
);

const AccountSection = () => {
    const request = useRequest();

    const { token } = useAuthenticationContext();

    const profile = useAsyncEffect(() => request<Profile>('/account/profile', 'GET').then((response) => response.data).catch(() => null), [token], undefined);

    // If profile is null, fetching the profile was unccesful due to a server error likely due to an expired token
    // If token is undefined it means there is no account logged in
    if (profile === null || token === undefined) {
        return (
            <>
                <Link to="/sign-in">Sign In</Link>
                <Link to="/sign-up">Sign Up</Link>
            </>
        );
    }

    // Login status still pending
    if (profile === undefined) {
        return <Oval />;
    }

    return (
        <>
            <span>{profile.username}</span>
            <Link to="/logout">Logout</Link>
        </>
    );
};

export const Header = () => (
    <header className="flex items-center p-5 border-b-4 gap-16 border-navy-300 justify-between fixed top-0 w-screen">
        <span className="text-navy-300 text-5xl mr-auto">robohub</span>
        <Link to="/blogs">Blogs</Link>
        <Link to="/teams">Teams</Link>
        <AccountSection />
        <Search className="hover:stroke-navy-300 duration-100" />
    </header>
);
