import { Search } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';
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

    const { data } = useSWR('/account/profile', (url) => request<Profile>(url, 'GET').then((response) => response.data).catch(() => null), { suspense: true });

    // If profile is null, fetching the profile was unccesful due to a server error likely due to an expired token
    // If token is undefined it means there is no account logged in
    if (data === null || token === undefined) {
        return (
            <>
                <Link to="/sign-in">Sign In</Link>
                <Link to="/sign-up">Sign Up</Link>
            </>
        );
    }

    return (
        <>
            <span>{data.username}</span>
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
