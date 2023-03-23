import { Search } from 'tabler-icons-react';
import { NavLink } from 'react-router-dom';
import { FC, PropsWithChildren, useState } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';
import { useRequest } from '../hooks/useRequest';
import { Profile, useAuthenticationContext } from '../AuthenticationContext';
import profilePicture from '../assets/profile_pic.png';
import caretIcon from '../assets/Caret.svg';

interface LinkProps {
    to: string;
}

const Link: FC<PropsWithChildren<LinkProps>> = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => clsx('text-xl link', isActive && 'underline text-navy-300')}>{children}</NavLink>
);

const AccountModal: FC<{ username: string }> = ({ username }) => (
    <div className="card absolute right-0 top-16 flex flex-col w-max">
        <span className="px-4 py-2 border-b-2 border-slate-700 text-lg">Username: <br /><strong>{username}</strong></span>
        <NavLink to="/organisations" className="modal-item">
            Your organisations
        </NavLink>
        <NavLink to="/settings" className="modal-item">
            Settings
        </NavLink>
        <NavLink to="/logout" className="modal-item rounded-b-md border-t-2 border-slate-700">
            Sign out
        </NavLink>
    </div>
);

const AccountSection = () => {
    const request = useRequest();

    const { token } = useAuthenticationContext();

    const [modalOpen, setModalOpen] = useState(false);

    // Pass token into key array to force revalidation when token changes
    const { data } = useSWR(['/account/profile', token], ([url]) => request<Profile>(url, 'GET').then((response) => response.data).catch(() => null), { suspense: true });

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
        <div className="relative">
            <button className="flex flex-row gap-2 items-center" onClick={() => setModalOpen((state) => !state)} type="button">
                <img src={profilePicture} alt="profile" className="h-12 w-12 rounded-full" />
                <img src={caretIcon} alt="caret" />
            </button>
            {modalOpen && <AccountModal username={data.username} />}
        </div>
    );
};

export const Header = () => (
    <header className="flex items-center p-5 border-b-4 gap-16 border-navy-300 justify-between fixed top-0 w-screen">
        <NavLink to="/" className="text-navy-300 text-5xl mr-auto">robohub</NavLink>
        <Link to="/blogs">Blogs</Link>
        <Link to="/teams">Teams</Link>
        <AccountSection />
        <Search className="hover:stroke-navy-300 duration-100" />
    </header>
);
