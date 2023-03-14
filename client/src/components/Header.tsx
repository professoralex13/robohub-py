import { Search } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

interface LinkProps {
    to: string;
}

const Link: FC<PropsWithChildren<LinkProps>> = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => clsx('text-xl link', isActive && 'underline text-navy-300')}>{children}</NavLink>
);

export const Header = () => (
    <header className="flex items-center p-5 border-b-4 gap-16 border-navy-300 justify-between fixed top-0 w-screen">
        <span className="text-navy-300 text-5xl mr-auto">robohub</span>
        <Link to="/blogs">Blogs</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/sign-in">Sign In</Link>
        <Link to="/sign-up">Sign Up</Link>
        <Search className="hover:stroke-navy-300 duration-100" />
    </header>
);
