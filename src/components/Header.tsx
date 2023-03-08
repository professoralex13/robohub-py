import { Search } from 'tabler-icons-react';

export const Header = () => (
    <div className="flex items-center p-5 border-b-4 space-x-16 border-blue-light justify-between">
        <span className="text-blue-light text-5xl mr-auto">robohub</span>
        <a className="text-xl link" href="/blogs">Blogs</a>
        <a className="text-xl link" href="/teams">Teams</a>
        <a className="text-xl link" href="/sign-in">Sign In</a>
        <a className="text-xl link" href="/sign-up">Sign Up</a>
        <Search className="hover:stroke-blue-light duration-100" />
    </div>
);
