import { Search } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';

interface LinkProps {
    to: string;
}

const Link: FC<PropsWithChildren<LinkProps>> = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => (`text-xl link ${isActive && 'underline'}`)}>{children}</NavLink>
);

export const Header = () => (
    <header className="flex items-center p-5 border-b-4 gap-16 border-navy-500 justify-between">
        <span className="text-navy-500 text-5xl mr-auto">robohub</span>
        <Link to="/blogs">Blogs</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/sign-in">Sign In</Link>
        <Link to="/sign-up">Sign Up</Link>
        <Search className="hover:stroke-navy-500 duration-100" />
    </header>
);
